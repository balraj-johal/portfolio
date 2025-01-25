import { mat4, vec3 } from "wgpu-matrix";

import { alignTo, FLOAT_LENGTH_BYTES } from "../../utils/math";
import { WebGpuApi } from "../../types";

type Clip = {
  near: number;
  far: number;
};

type ScreenSize = {
  width: number;
  height: number;
};

// interface FpsCameraProperties {
//   position: v3;
//   screenSize: ScreenSize;
//   /** Vertical Field of View */
//   vFov?: number;
//   clip: Clip;
// }

const DEFAULT_PROPERTIES = {
  position: [0, 0, 3],
  vFov: 45,
  clip: {
    near: 0.1,
    far: 1000,
  },
};

const SCENE_ORIGIN_POSITION = new Float32Array([0, 0, 0]);

export interface CameraProperties {
  canvas: HTMLCanvasElement;
  position?: Float32Array;
  nearPlane?: number;
  farPlane?: number;
  vFov?: number;
}

const PROJECTION_VIEW_MATRIX_SIZE = 16;
const POSITION_MATRIX_SIZE = 4;
const CAMERA_BUFFER_SIZE = PROJECTION_VIEW_MATRIX_SIZE + POSITION_MATRIX_SIZE;

export class Camera {
  private vFov: number;
  private clip: Clip;

  private canvas: HTMLCanvasElement;
  private screenSize: ScreenSize;
  private readonly resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (!entry.borderBoxSize) continue;
      const { blockSize, inlineSize } = entry.borderBoxSize[0];
      this.screenSize.width = inlineSize;
      this.screenSize.height = blockSize;
    }
  });

  private forward: Float32Array;
  private up = new Float32Array([0, 1, 0]);
  private right = new Float32Array([1, 0, 0]);

  position: Float32Array;

  projectionMatrix = mat4.create();
  viewMatrix = mat4.create();
  projectionViewMatrix = mat4.create();

  buffer?: GPUBuffer;

  constructor(properties: CameraProperties) {
    this.canvas = properties.canvas;
    this.resizeObserver.observe(this.canvas);

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.position = new Float32Array([0, 0, 3]);
    this.vFov = properties.vFov ?? DEFAULT_PROPERTIES.vFov;
    const near = properties.nearPlane ?? 0.1;
    const far = properties.farPlane ?? 100;
    this.screenSize = { width, height };
    this.clip = { near, far };

    this.forward = vec3.subtract(this.position, SCENE_ORIGIN_POSITION);

    this.updateProjectionViewMatrix();
  }

  private setProjectionMatrix(vFov: number, aspectRatio: number, clip: Clip) {
    return mat4.perspective(
      vFov,
      aspectRatio,
      clip.near,
      clip.far,
      this.projectionMatrix,
    );
  }

  private setViewMatrix(
    position: Float32Array,
    target: Float32Array,
    up: Float32Array,
  ) {
    // // TODO: apply rotations
    return mat4.lookAt(position, target, up, this.viewMatrix);
  }

  private updateProjectionViewMatrix() {
    this.setProjectionMatrix(
      this.vFov,
      this.screenSize.width / this.screenSize.height,
      this.clip,
    );

    this.setViewMatrix(this.position, SCENE_ORIGIN_POSITION, this.up);

    mat4.mul(this.projectionMatrix, this.viewMatrix, this.projectionViewMatrix);
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();

    this.screenSize.width = width;
    this.screenSize.height = height;
  }

  reproject() {
    this.updateProjectionViewMatrix();
  }

  createBuffer(api: WebGpuApi) {
    this.buffer = api.device.createBuffer({
      // TODO: do I need to align this also?
      size: CAMERA_BUFFER_SIZE * FLOAT_LENGTH_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return this.buffer;
  }

  updateBuffer(api: WebGpuApi) {
    if (!this.buffer) throw new Error("No camera buffer to update.");

    // TODO: does this need to be aligned? the GPU buffer is the only one that might need to be right?
    const alignedSize = alignTo(CAMERA_BUFFER_SIZE, FLOAT_LENGTH_BYTES);
    const data = new Float32Array(alignedSize);

    data.set(this.projectionViewMatrix, 0);
    data.set(this.position, 16);

    api.device.queue.writeBuffer(this.buffer, 0, data);

    return this.buffer;
  }
}
