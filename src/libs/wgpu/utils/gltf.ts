import { GltfJsonHeader } from "../types/gltf";
import { GLTFComponentType, GLTFType } from "../types";

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

export function readGlbJsonHeader(mappedBuffer: ArrayBuffer) {
  const jsonHeader = new Uint32Array(mappedBuffer, 0, 5);
  validateGlbJsonHeader(jsonHeader);

  const byteOffset = 20;
  const chunkLength = jsonHeader[3];

  return {
    header: JSON.parse(
      new TextDecoder("utf-8").decode(
        new Uint8Array(mappedBuffer, byteOffset, chunkLength),
      ),
    ) as GltfJsonHeader,
    byteOffset: byteOffset,
    chunkLength: chunkLength,
  };
}

export function readGlbBinaryHeader(mappedBuffer: ArrayBuffer, offset: number) {
  const binaryHeader = new Uint32Array(mappedBuffer, offset, 2);
  validateGlbBinaryHeader(binaryHeader);

  return binaryHeader;
}

export function getGltfTypeSize(
  componentType: GLTFComponentType,
  type: GLTFType,
) {
  let componentSize = 0;
  switch (componentType) {
    case GLTFComponentType.BYTE:
      componentSize = 1;
      break;
    case GLTFComponentType.UNSIGNED_BYTE:
      componentSize = 1;
      break;
    case GLTFComponentType.SHORT:
      componentSize = 2;
      break;
    case GLTFComponentType.UNSIGNED_SHORT:
      componentSize = 2;
      break;
    case GLTFComponentType.INT:
      componentSize = 4;
      break;
    case GLTFComponentType.UNSIGNED_INT:
      componentSize = 4;
      break;
    case GLTFComponentType.FLOAT:
      componentSize = 4;
      break;
    case GLTFComponentType.DOUBLE:
      componentSize = 8;
      break;
    default:
      throw Error("Unrecognized GLTF Component Type?");
  }
  return gltfTypeToNumber(type) * componentSize;
}

export function parseGltfType(type: string) {
  switch (type) {
    case "SCALAR":
      return GLTFType.SCALAR;
    case "VEC2":
      return GLTFType.VEC2;
    case "VEC3":
      return GLTFType.VEC3;
    case "VEC4":
      return GLTFType.VEC4;
    case "MAT2":
      return GLTFType.MAT2;
    case "MAT3":
      return GLTFType.MAT3;
    case "MAT4":
      return GLTFType.MAT4;
    default:
      throw Error(`Unhandled glTF Type ${type}`);
  }
}

export function gltfTypeToNumber(type: GLTFType) {
  switch (type) {
    case GLTFType.SCALAR:
      return 1;
    case GLTFType.VEC2:
      return 2;
    case GLTFType.VEC3:
      return 3;
    case GLTFType.VEC4:
    case GLTFType.MAT2:
      return 4;
    case GLTFType.MAT3:
      return 9;
    case GLTFType.MAT4:
      return 16;
    default:
      throw Error(`Invalid glTF Type ${type}`);
  }
}

// Note: only returns non-normalized type names,
// so byte/ubyte = sint8/uint8, not snorm8/unorm8, same for ushort
export function gltfVertexType(
  componentType: GLTFComponentType,
  type: GLTFType,
): GPUVertexFormat | GPUIndexFormat {
  const typeString = (() => {
    switch (componentType) {
      case GLTFComponentType.BYTE:
        return "sint8";
      case GLTFComponentType.UNSIGNED_BYTE:
        return "uint8";
      case GLTFComponentType.SHORT:
        return "sint16";
      case GLTFComponentType.UNSIGNED_SHORT:
        return "uint16";
      case GLTFComponentType.INT:
        return "int32";
      case GLTFComponentType.UNSIGNED_INT:
        return "uint32";
      case GLTFComponentType.FLOAT:
        return "float32";
      default:
        throw Error(`Unrecognized or unsupported glTF type ${componentType}`);
    }
  })();

  // TODO: bad type assertion here! There's some values that can be returned from this
  // type that aren't actually valid in the GPUVertexFormat type, e.g. 'uint8' alone
  switch (gltfTypeToNumber(type)) {
    case 1:
      return typeString as GPUVertexFormat;
    case 2:
      return (typeString + "x2") as GPUVertexFormat;
    case 3:
      return (typeString + "x3") as GPUVertexFormat;
    case 4:
      return (typeString + "x4") as GPUVertexFormat;
    default:
      throw Error(`Invalid number of components for gltfType: ${type}`);
  }
}

export function gltfTypeSize(componentType: GLTFComponentType, type: GLTFType) {
  let componentSize = 0;
  switch (componentType) {
    case GLTFComponentType.BYTE:
      componentSize = 1;
      break;
    case GLTFComponentType.UNSIGNED_BYTE:
      componentSize = 1;
      break;
    case GLTFComponentType.SHORT:
      componentSize = 2;
      break;
    case GLTFComponentType.UNSIGNED_SHORT:
      componentSize = 2;
      break;
    case GLTFComponentType.INT:
      componentSize = 4;
      break;
    case GLTFComponentType.UNSIGNED_INT:
      componentSize = 4;
      break;
    case GLTFComponentType.FLOAT:
      componentSize = 4;
      break;
    case GLTFComponentType.DOUBLE:
      componentSize = 8;
      break;
    default:
      throw Error("Unrecognized GLTF Component Type?");
  }
  return gltfTypeToNumber(type) * componentSize;
}
