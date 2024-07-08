import { GLTFSampler } from "./GLTFSampler";
import { GLTFImage } from "./GLTFImage";

type GLTFResolvedTextureType = {
  sampler: GLTFSampler;
  image: GLTFImage;
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
    console.log(this);
  }
}
