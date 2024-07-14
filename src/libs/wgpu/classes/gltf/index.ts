import { mat4 } from "gl-matrix";

import { readGlbJsonHeader, readGlbBinaryHeader } from "../../utils/gltf";
import {
  GltfJsonHeader,
  GltfNode,
  GltfTextureList,
  MaterialTextureConfiguration,
} from "../../types/gltf";
import { GLTFRenderMode, WebGpuApi } from "../../types";
import { GLTFTexture, TEXTURE_USAGE_FROM_NAME } from "./GLTFTexture";
import { GLTFScene } from "./GLTFScene";
import { GLTFSampler } from "./GLTFSampler";
import { GLTFPrimitive, SupportedPrimitiveAttribute } from "./GLTFPrimitive";
import { GltfPbrMaterial, SupportedTexture } from "./GltfPbrMaterial";
import { GLTFNode, getNodeTransformMatrix } from "./GLTFNode";
import { GLTFMesh } from "./GLTFMesh";
import { GLTFImage } from "./GLTFImage";
import { GLTFBufferView } from "./GLTFBufferView";
import { GLTFBuffer } from "./GLTFBuffer";
import { GLTFAccessor } from "./GLTFAccessor";

export function buildPrimitiveClass(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primitiveData: any,
  accessors: GLTFAccessor[],
  materials: GltfPbrMaterial[],
): GLTFPrimitive {
  // determine primitive's render mode
  const mode = primitiveData.mode ?? GLTFRenderMode.TRIANGLES;
  if (
    mode != GLTFRenderMode.TRIANGLES &&
    mode != GLTFRenderMode.TRIANGLE_STRIP
  ) {
    throw Error(`Currently Unsupported primitive mode ${mode}`);
  }

  // Find the vertex indices accessor if provided
  const indices = accessors[primitiveData.indices];

  const getAttributeAccessor = (target: SupportedPrimitiveAttribute) => {
    const match = Object.entries(primitiveData.attributes).find(
      ([attribute]) => {
        return attribute === target;
      },
    );

    if (!match) return undefined;
    // TODO: fix fucky type
    const accessor = accessors[match[1] as number];
    return accessor;
  };

  const positions: GLTFAccessor | undefined = getAttributeAccessor(
    SupportedPrimitiveAttribute.POSITION,
  );
  const normals: GLTFAccessor | undefined = getAttributeAccessor(
    SupportedPrimitiveAttribute.NORMAL,
  );
  const texCoord0: GLTFAccessor | undefined = getAttributeAccessor(
    SupportedPrimitiveAttribute.TEXCOORD_0,
  );

  if (!positions) {
    throw new Error("No positions accessor present building GLTFPrimitive");
  }

  // TODO: this is hardcoding an error whenever there's no tex coords.
  if (!texCoord0) {
    throw new Error("No texCoord0 accessor present building GLTFPrimitive");
  }

  const material = materials[primitiveData.material];
  console.log(material);

  return new GLTFPrimitive({
    material,
    mode,
    positions,
    normals,
    texCoords: [texCoord0],
    indices,
  });
}

const getNodeFromHeader = (jsonHeader: GltfJsonHeader, index: number) => {
  if (!jsonHeader.nodes) throw new Error("No nodes in gltf");
  return jsonHeader.nodes[index];
};

// TODO: We'll need to put a bit more thought here when we start handling animated nodes
// in the hierarchy. For now this is fine.
// https://github.com/Twinklebear/webgpu-0-to-gltf/blob/main/4-full-scene-ts/src/glb_mesh.ts#L90
const flattenSceneTreeTransforms = (
  jsonHeader: GltfJsonHeader,
  meshes: GLTFMesh[],
  flattenedNodes: GLTFNode[],
  node: GltfNode,
  parentTransform: mat4,
) => {
  const nodeFinalMatrix = mat4.clone(parentTransform);
  const nodeUnflattenedMatrix = getNodeTransformMatrix(node);
  if (nodeUnflattenedMatrix) {
    mat4.multiply(nodeFinalMatrix, nodeFinalMatrix, nodeUnflattenedMatrix);
  }

  // lookup mesh class with the node index
  const targetMesh = node.mesh !== undefined ? meshes[node.mesh] : undefined;

  // add node to flattened array
  flattenedNodes.push(
    new GLTFNode({
      mesh: targetMesh,
      camera: node.camera,
      transformMatrix: nodeFinalMatrix,
    }),
  );

  // continue recursion if node has children
  if (node.children) {
    for (const childNodeIndex of node.children) {
      const childNode = getNodeFromHeader(jsonHeader, childNodeIndex);
      flattenSceneTreeTransforms(
        jsonHeader,
        meshes,
        flattenedNodes,
        childNode,
        nodeFinalMatrix,
      );
    }
  } else {
    // end recursion
    return;
  }
};

export async function uploadGlb(buffer: ArrayBuffer, api: WebGpuApi) {
  // parse the .glb's json header
  const { jsonHeader, jsonByteOffset, jsonChunkLength } =
    readGlbJsonHeader(buffer);

  console.log("jsonHeader", jsonHeader);

  // parse the .glb's binary header
  const binaryHeader = readGlbBinaryHeader(
    buffer,
    jsonByteOffset + jsonChunkLength,
  );

  // create a new GLTFBuffer from the binary chunk
  const binaryChunk = new GLTFBuffer(
    buffer,
    // TODO: why 8 here?
    8 + jsonByteOffset + jsonChunkLength,
    binaryHeader[0],
  );

  // prepare all the buffer views for uploading to the GPU
  const preparedBufferViews: GLTFBufferView[] = [];
  if (!jsonHeader.bufferViews) throw new Error("No buffer views in gltf");

  for (const gltfBufferView of jsonHeader.bufferViews) {
    preparedBufferViews.push(new GLTFBufferView(binaryChunk, gltfBufferView));
  }

  // upload prepared views to the GPU
  for (const preparedBufferView of preparedBufferViews) {
    if (preparedBufferView.needsUpload) preparedBufferView.upload(api.device);
  }

  // create class representations of GLTF accessors
  const accessors: GLTFAccessor[] = [];
  if (!jsonHeader.accessors) throw new Error("No accessors in gltf");

  for (const gltfAccessor of jsonHeader.accessors) {
    const accessorBufferView = preparedBufferViews[gltfAccessor.bufferView];
    accessors.push(new GLTFAccessor(accessorBufferView, gltfAccessor));
  }

  // prepare all the texture samplers
  const samplers: GLTFSampler[] = [];
  if (jsonHeader.samplers) {
    for (const sampler of jsonHeader.samplers) {
      samplers.push(new GLTFSampler(sampler));
    }
  }

  // prepare all the gltf's images
  const images: GLTFImage[] = [];
  if (jsonHeader.images) {
    for (const image of jsonHeader.images) {
      images.push(
        new GLTFImage({
          image,
          bufferView: preparedBufferViews[image.bufferView],
        }),
      );
    }
  }

  // prepare all the gltf's textures
  const textures: GLTFTexture[] = [];
  if (jsonHeader.textures) {
    for (const { source, sampler } of jsonHeader.textures) {
      const preparedSampler = (() => {
        if (sampler) {
          return samplers[sampler];
        } else {
          const defaultSampler = new GLTFSampler();
          samplers.push(defaultSampler);
          return defaultSampler;
        }
      })();

      textures.push(
        new GLTFTexture({ image: images[source], sampler: preparedSampler }),
      );
    }
  }

  // prepare all the gltf's materials
  const materials: GltfPbrMaterial[] = [];
  if (jsonHeader.materials) {
    for (const material of jsonHeader.materials) {
      const getMaterialTextureEntries = () => {
        const pbrMetallicRoughnessEntries = Object.entries(
          material.pbrMetallicRoughness,
        );
        const baseEntries = Object.entries(material);
        // @ts-expect-error TODO: fix fucky types here
        const entries = [...baseEntries].concat(pbrMetallicRoughnessEntries);

        return entries.filter(([key]) => key.includes("Texture")) as [
          string,
          MaterialTextureConfiguration,
        ][];
      };

      const getMaterialTextureList = (
        entries: [string, MaterialTextureConfiguration][],
      ): GltfTextureList => {
        return [...entries].map(([name, config]) => {
          const preparedClass = textures[config.index];
          return [name, preparedClass];
        });
      };

      const setMaterialTextureImageUsages = (textureList: GltfTextureList) => {
        for (const [name, preparedTexture] of textureList) {
          preparedTexture.setImageUsage(
            TEXTURE_USAGE_FROM_NAME[name as SupportedTexture],
          );
        }
      };

      const entries = getMaterialTextureEntries();
      const textureList = getMaterialTextureList(entries);
      setMaterialTextureImageUsages(textureList);

      materials.push(new GltfPbrMaterial(material, textureList));
    }
  }

  // generate array of meshes present in GLTF
  const meshes: GLTFMesh[] = [];
  if (!jsonHeader.meshes) throw new Error("No meshes in gltf");

  for (const mesh of jsonHeader.meshes) {
    // build each meshes primitives (read: "submesh")
    const primitives: GLTFPrimitive[] = [];
    for (const primitive of mesh.primitives) {
      const preparedPrimitiveClass = buildPrimitiveClass(
        primitive,
        accessors,
        materials,
      );
      primitives.push(preparedPrimitiveClass);
    }
    meshes.push(
      new GLTFMesh({
        name: mesh.name,
        primitives: primitives,
      }),
    );
  }

  // ---- UPLOAD EVERYTHING TO GPU

  // upload buffer views
  for (const bufferView of preparedBufferViews) {
    if (bufferView.needsUpload) {
      bufferView.upload(api.device);
    }
  }

  // create and upload GPU images
  for (const image of images) {
    await image.createImageBitmapFromBufferView();
    image.createGpuTexture(api);
    image.upload(api);
  }

  // create and upload GPU samplers
  for (const sampler of samplers) {
    sampler.create(api);
  }

  // upload material bind groups
  for (const material of materials) {
    material.upload(api);
  }

  // ---- PROCESS SCENE

  // flatten every node's transforms in the default scene
  if (!jsonHeader.scenes) throw new Error("No scenes in gltf");
  const flattenedTreeNodes: GLTFNode[] = [];
  const defaultSceneIndex = jsonHeader.scene || 0;
  const defaultSceneData = jsonHeader.scenes[defaultSceneIndex];

  for (const sceneRootNodeIndex of defaultSceneData.nodes) {
    const sceneRootNode = getNodeFromHeader(jsonHeader, sceneRootNodeIndex);
    flattenSceneTreeTransforms(
      jsonHeader,
      meshes,
      flattenedTreeNodes,
      sceneRootNode,
      mat4.create(),
    );
  }

  return new GLTFScene({ flattenedNodes: flattenedTreeNodes });
}
