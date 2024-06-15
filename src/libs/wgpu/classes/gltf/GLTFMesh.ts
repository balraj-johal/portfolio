import { GLTFPrimitive } from "./GLTFPrimitive";

/**
 * @description A GLTFMesh describes a single mesh in a gltf file.
 *              This mesh can have multiple primitives ("sub meshes").
 *
 * NOTE: only supports single embedded binary */
export class GLTFMesh {
  name?: string;
  primitives: GLTFPrimitive[] = [];

  constructor({
    name,
    primitives,
  }: {
    name?: string;
    primitives: GLTFPrimitive[];
  }) {
    this.name = name;
    this.primitives = primitives;
    console.log(this);
  }

  // TODO:
  buildRenderPipeline() {}

  // TODO:
  render() {}
}
