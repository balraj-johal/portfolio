import { readGlbJsonHeader, readGlbBinaryHeader } from "../../utils/gltf";
import { GLTFRenderMode } from "../../types";
import { GLTFPrimitive } from "./GLTFPrimitive";
import { GLTFMesh } from "./GLTFMesh";
import { GLTFBufferView } from "./GLTFBufferView";
import { GLTFBuffer } from "./GLTFBuffer";
import { GLTFAccessor } from "./GLTFAccessor";

function buildPrimitiveClass(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primitiveData: any,
  accessors: GLTFAccessor[],
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

  // get the positions accessor
  const positions: GLTFAccessor | undefined = (() => {
    for (const attribute in primitiveData["attributes"]) {
      const accessor = accessors[primitiveData["attributes"][attribute]];
      if (attribute == "POSITION") {
        return accessor;
      }
    }
  })();

  if (!positions) {
    throw new Error("No positions accessor present building GLTFPrimitive");
  }

  return new GLTFPrimitive({ mode, positions, indices });
}

export function uploadGlb(buffer: ArrayBuffer, device: GPUDevice) {
  // parse the .glb's json header
  const {
    header,
    byteOffset: jsonByteOffset,
    chunkLength: jsonChunkLength,
  } = readGlbJsonHeader(buffer);

  // parse the .glb's binary header
  const binaryHeader = readGlbBinaryHeader(
    buffer,
    jsonByteOffset + jsonChunkLength,
  );

  // create a new GLTFBuffer from the binary chunk
  const binaryChunk = new GLTFBuffer(
    buffer,
    8 + jsonByteOffset + jsonChunkLength,
    binaryHeader[0],
  );

  // prepare all the buffer views for uploading to the GPU
  const preparedBufferViews: GLTFBufferView[] = [];
  for (const gltfBufferView of header.bufferViews) {
    preparedBufferViews.push(new GLTFBufferView(binaryChunk, gltfBufferView));
  }

  // upload necessary views to the GPU
  for (const preparedBufferView of preparedBufferViews) {
    if (preparedBufferView.needsUpload) preparedBufferView.upload(device);
  }

  const accessors: GLTFAccessor[] = [];
  // TODO: handle errors if the GLB has an accessor that isn't supported in this engine
  for (const gltfAccessor of header.accessors) {
    const accessorBufferView = preparedBufferViews[gltfAccessor.bufferView];
    accessors.push(new GLTFAccessor(accessorBufferView, gltfAccessor));
  }

  const meshes: GLTFMesh[] = [];
  for (const mesh of header.meshes) {
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

  // return GLTF Meshes?
  return meshes;
}
