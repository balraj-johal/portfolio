import { GltfImageType, SupportedMimeType } from "../../types/gltf";
import { WebGpuApi } from "../../types";
import { GLTFBufferView } from "./GLTFBufferView";

type Properties = {
  image: GltfImageType;
  bufferView: GLTFBufferView;
};

export enum ImageUsage {
  BASE_COLOR,
  METALLIC_ROUGHNESS,
  NORMAL,
  OCCLUSION,
  EMISSION,
}

/** An object of sensible image formats from the image's usage */
export const IMAGE_FORMAT_FROM_USAGE: Record<ImageUsage, GPUTextureFormat> = {
  [ImageUsage.BASE_COLOR]: "rgba8unorm-srgb",
  [ImageUsage.METALLIC_ROUGHNESS]: "rgba8unorm",
  // TODO: confirm the formats of the following usages
  [ImageUsage.NORMAL]: "rgba8unorm",
  [ImageUsage.OCCLUSION]: "rgba8unorm",
  [ImageUsage.EMISSION]: "rgba8unorm-srgb",
};

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFImage {
  mimeType: SupportedMimeType;
  usage: ImageUsage = ImageUsage.BASE_COLOR;
  bitmap?: ImageBitmap;
  gpuTexture?: GPUTexture;
  gpuTextureView?: GPUTextureView;
  bufferViewIndex: number;
  bufferView: GLTFBufferView;
  imageSize: [number, number, number];

  constructor({ image, bufferView }: Properties) {
    if (!this.isMimeTypeValid(image.mimeType))
      throw new Error(`Mime type ${image.mimeType} is not supported`);

    this.bufferViewIndex = image.bufferView;
    this.bufferView = bufferView;
    this.mimeType = image.mimeType;

    this.imageSize = [1, 1, 1];
  }

  /** Process buffer view into an ImageBitmap of the specified format.
   *
   * TODO: how will this react to a bufferView with mimeType ktx2?
   */
  async createImageBitmapFromBufferView() {
    console.log("creating bitmap");
    const blob = new Blob([this.bufferView.view], { type: this.mimeType });
    this.bitmap = await createImageBitmap(blob);
    this.imageSize = [this.bitmap.width, this.bitmap.height, 1];
  }

  createGpuTexture(api: WebGpuApi) {
    const textureDescriptor: GPUTextureDescriptor = {
      size: this.imageSize,
      format: IMAGE_FORMAT_FROM_USAGE[ImageUsage.BASE_COLOR],
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        // Note: the render attachment usage is required for
        // copyExternalImageToTexture we aren't going to actually
        // render to these images ourselves
        GPUTextureUsage.RENDER_ATTACHMENT,
    };

    this.gpuTexture = api.device.createTexture(textureDescriptor);
  }

  setUsage(usage: ImageUsage) {
    this.usage = usage;
  }

  /** Upload generated bitmap format image to the created GPUTexture */
  upload(api: WebGpuApi) {
    if (!this.gpuTexture)
      throw new Error("gpuTexture has not been created before upload.");
    if (!this.bitmap)
      throw new Error("An ImageBitmap has not been created before upload.");

    api.device.queue.copyExternalImageToTexture(
      { source: this.bitmap },
      { texture: this.gpuTexture },
      this.imageSize,
    );

    this.gpuTextureView = this.gpuTexture.createView();
    this.gpuTextureView.label = "GLTFImage GpuTextureView";
  }

  private isMimeTypeValid(type: string) {
    return Object.values(SupportedMimeType).includes(type as SupportedMimeType);
  }
}
