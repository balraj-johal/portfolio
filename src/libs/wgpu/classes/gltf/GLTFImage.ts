import { GltfImageType, SupportedMimeType } from "../../types/gltf";

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFImage {
  mimeType: SupportedMimeType;
  bufferViewIndex: number;

  constructor(image: GltfImageType) {
    if (!this.isMimeTypeValid(image.mimeType)) {
      throw new Error(`Mime type ${image.mimeType} is not supported`);
    }

    this.bufferViewIndex = image.bufferView;
    this.mimeType = image.mimeType;
  }

  private isMimeTypeValid(type: string) {
    return Object.values(SupportedMimeType).includes(type as SupportedMimeType);
  }
}
