import { mat4 } from "gl-matrix";

import { readGlbJsonHeader, readGlbBinaryHeader } from "../../utils/gltf";
import { GltfJsonHeader, GltfNode } from "../../types/gltf";
import { GLTFScene } from "./GLTFScene";
import { GLTFPrimitive, buildPrimitiveClass } from "./GLTFPrimitive";
import { GLTFNode, getNodeTransformMatrix } from "./GLTFNode";
import { GLTFMesh } from "./GLTFMesh";
import { GLTFBufferView } from "./GLTFBufferView";
import { GLTFBuffer } from "./GLTFBuffer";
import { GLTFAccessor } from "./GLTFAccessor";

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

export function uploadGlb(buffer: ArrayBuffer, device: GPUDevice) {
  // parse the .glb's json header
  const { jsonHeader, jsonByteOffset, jsonChunkLength } =
    readGlbJsonHeader(buffer);

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

  // upload prepares views to the GPU
  for (const preparedBufferView of preparedBufferViews) {
    if (preparedBufferView.needsUpload) preparedBufferView.upload(device);
  }

  // create class representations of GLTF accessors
  const accessors: GLTFAccessor[] = [];
  if (!jsonHeader.accessors) throw new Error("No accessors in gltf");

  for (const gltfAccessor of jsonHeader.accessors) {
    const accessorBufferView = preparedBufferViews[gltfAccessor.bufferView];
    accessors.push(new GLTFAccessor(accessorBufferView, gltfAccessor));
  }

  // generate array of meshes present in GLTF
  const meshes: GLTFMesh[] = [];
  if (!jsonHeader.meshes) throw new Error("No meshes in gltf");

  for (const mesh of jsonHeader.meshes) {
    // build each meshes primitives (read: "submesh")
    const primitives: GLTFPrimitive[] = [];
    for (const primitive of mesh.primitives) {
      primitives.push(buildPrimitiveClass(primitive, accessors));
    }
    meshes.push(
      new GLTFMesh({
        name: mesh.name,
        primitives: primitives,
      }),
    );
  }

  // upload everything required to the GPU
  for (const bufferView of preparedBufferViews) {
    if (bufferView.needsUpload) {
      bufferView.upload(device);
    }
  }

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
