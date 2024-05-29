import { GLTFBufferView } from "../classes/gltf/glb/GLTFBufferView";
import { GLTFBuffer } from "../classes/gltf/glb/GLTFBuffer";

const BINARY_GLTF_MAGIC = 0x46546c67;

export function validateGlbJsonHeader(header: Uint32Array) {
  // Validate glb file contains correct magic value
  if (header[0] != BINARY_GLTF_MAGIC) {
    throw Error("Provided file is not a glB file");
  }
  if (header[1] != 2) {
    throw Error("Provided file is glTF 2.0 file");
  }
  // Validate that first chunk is Json
  if (header[4] != 0x4e4f534a) {
    throw Error(
      "Invalid glB: The first chunk of the glB file is not a Json chunk!",
    );
  }
}
export function validateGlbBinaryHeader(header: Uint32Array) {
  if (header[1] != 0x004e4942) {
    throw Error(
      "Invalid glB: The second chunk of the glB file is not a binary chunk!",
    );
  }
}

const readGlbJsonHeader = (mappedBuffer: ArrayBuffer) => {
  const jsonHeader = new Uint32Array(mappedBuffer, 0, 5);
  validateGlbJsonHeader(jsonHeader);

  const byteOffset = 20;
  const chunkLength = jsonHeader[3];

  return {
    json: JSON.parse(
      new TextDecoder("utf-8").decode(
        new Uint8Array(mappedBuffer, byteOffset, chunkLength),
      ),
    ),
    byteOffset: byteOffset,
    chunkLength: chunkLength,
  };
};

const readGlbBinaryHeader = (mappedBuffer: ArrayBuffer, offset: number) => {
  const binaryHeader = new Uint32Array(mappedBuffer, offset, 2);
  validateGlbBinaryHeader(binaryHeader);

  return binaryHeader;
};

export function uploadGLB(buffer: GPUBuffer, device: GPUDevice) {
  const mappedBuffer = buffer.getMappedRange();
  const {
    json,
    byteOffset: jsonByteOffset,
    chunkLength: jsonChunkLength,
  } = readGlbJsonHeader(mappedBuffer);

  const binaryHeader = readGlbBinaryHeader(
    mappedBuffer,
    jsonByteOffset + jsonChunkLength,
  );

  const binaryChunk = new GLTFBuffer(
    mappedBuffer,
    8 + jsonByteOffset + jsonChunkLength,
    binaryHeader[0],
  );

  console.log(json, device, binaryChunk);

  const bufferViews: GLTFBufferView[] = [];
  for (const bufferView of json.bufferViews) {
    bufferViews.push(new GLTFBufferView(binaryChunk, bufferView));
  }

  // buffer.unmap();
}
