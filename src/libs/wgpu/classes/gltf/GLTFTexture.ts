import { GLTFSampler } from "./GLTFSampler";
import { SupportedTexture } from "./GltfPbrMaterial";
import { GLTFImage, ImageUsage } from "./GLTFImage";

type GLTFResolvedTextureType = {
  sampler: GLTFSampler;
  image: GLTFImage;
};

/** An object mapping a texture to its image usage  */
export const TEXTURE_USAGE_FROM_NAME: Record<SupportedTexture, ImageUsage> = {
  [SupportedTexture.BaseColor]: ImageUsage.BASE_COLOR,
  [SupportedTexture.MetallicRoughness]: ImageUsage.METALLIC_ROUGHNESS,
  [SupportedTexture.Normal]: ImageUsage.NORMAL,
  [SupportedTexture.Occlusion]: ImageUsage.OCCLUSION,
  [SupportedTexture.Emissive]: ImageUsage.EMISSION,
};

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFTexture {
  sampler: GLTFSampler;
  image: GLTFImage;

  constructor(resolvedTexture: GLTFResolvedTextureType) {
    this.sampler = resolvedTexture.sampler;
    this.image = resolvedTexture.image;
  }

  setImageUsage(usage: ImageUsage) {
    this.image.setUsage(usage);
  }
}
