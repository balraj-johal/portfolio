import { readGlbJsonHeader, readGlbBinaryHeader } from "../../utils/gltf";
import { GLTFPrimitive, buildPrimitiveClass } from "./GLTFPrimitive";
import { GLTFMesh } from "./GLTFMesh";
import { GLTFBufferView } from "./GLTFBufferView";
import { GLTFBuffer } from "./GLTFBuffer";
import { GLTFAccessor } from "./GLTFAccessor";

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

  console.log(header.scenes);

  // prepare all the buffer views for uploading to the GPU
  const preparedBufferViews: GLTFBufferView[] = [];
  if (!header.bufferViews) throw new Error("No buffer views in gltf");
  for (const gltfBufferView of header.bufferViews) {
    preparedBufferViews.push(new GLTFBufferView(binaryChunk, gltfBufferView));
  }

  // upload necessary views to the GPU
  for (const preparedBufferView of preparedBufferViews) {
    if (preparedBufferView.needsUpload) preparedBufferView.upload(device);
  }

  const accessors: GLTFAccessor[] = [];
  // TODO: handle errors if the GLB has an accessor that isn't supported in this engine
  if (!header.accessors) throw new Error("No accessors in gltf");
  for (const gltfAccessor of header.accessors) {
    const accessorBufferView = preparedBufferViews[gltfAccessor.bufferView];
    accessors.push(new GLTFAccessor(accessorBufferView, gltfAccessor));
  }

  const meshes: GLTFMesh[] = [];
  if (!header.meshes) throw new Error("No meshes in gltf");
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
