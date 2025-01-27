import { mat4, quat, vec3 } from "wgpu-matrix";

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

const DEFAULT_PROPERTIES = {
  position: [0, 0, 3],
  vFov: 45,
  clip: {
    near: 0.1,
    far: 1000,
  },
};

const SCENE_ORIGIN_POSITION = new Float32Array([0, 0, 0]);
const VEC_3_IDENTITY = vec3.create(0, 0, 0);

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
  private readonly canvas: HTMLCanvasElement;
  private readonly screenSize: ScreenSize;
  private readonly clip: Clip;
  private readonly resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (!entry.borderBoxSize) continue;

      const { blockSize, inlineSize } = entry.borderBoxSize[0];
      this.screenSize.width = inlineSize;
      this.screenSize.height = blockSize;
    }
  });

  private vFov: number;

  forward: Float32Array;
  up = vec3.create(0, 1, 0);
  right = vec3.create(1, 0, 0);

  private rotation = quat.identity();
  position: Float32Array;

  rotationMatrix = mat4.create();
  projectionMatrix = mat4.create();
  viewMatrix = mat4.create();
  projectionViewMatrix = mat4.create();

  buffer?: GPUBuffer;

  constructor(properties: CameraProperties) {
    this.canvas = properties.canvas;
    this.resizeObserver.observe(this.canvas);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const near = properties.nearPlane ?? DEFAULT_PROPERTIES.clip.near;
    const far = properties.farPlane ?? DEFAULT_PROPERTIES.clip.far;

    this.position = vec3.create(0, 0, 3);
    this.vFov = properties.vFov ?? DEFAULT_PROPERTIES.vFov;
    this.screenSize = { width, height };
    this.clip = { near, far };

    const directionToCamera = vec3.subtract(
      this.position,
      SCENE_ORIGIN_POSITION,
    );
    this.forward = vec3.normalize(directionToCamera);

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

  private getTranslationMatrix(position: Float32Array) {
    const [x, y, z] = position;
    return mat4.set(1, 0, 0, -x, 0, 1, 0, -y, 0, 0, 1, -z, 0, 0, 0, 1);
  }

  private setViewMatrix(position: Float32Array) {
    const translationMatrix = this.getTranslationMatrix(position);
    const inverseTranslationMatrix = mat4.transpose(translationMatrix);

    this.viewMatrix = mat4.mul(this.rotationMatrix, inverseTranslationMatrix);
  }

  private updateProjectionViewMatrix() {
    const { width, height } = this.screenSize;
    const aspectRatio = width / height;

    this.setProjectionMatrix(this.vFov, aspectRatio, this.clip);
    this.setViewMatrix(this.position);

    mat4.mul(this.projectionMatrix, this.viewMatrix, this.projectionViewMatrix);
  }

  /**
   * Applies the provided axis rotations (in rads) to the rotation quaternion,
   * then updates the rotation matrix.
   */
  rotate(x: number, y: number, z: number) {
    // update direction vectors
    vec3.rotateX(this.forward, VEC_3_IDENTITY, x, this.forward);
    vec3.rotateY(this.forward, VEC_3_IDENTITY, y, this.forward);
    vec3.rotateX(this.right, VEC_3_IDENTITY, x, this.right);
    vec3.rotateY(this.right, VEC_3_IDENTITY, y, this.right);
    vec3.rotateX(this.up, VEC_3_IDENTITY, x, this.up);
    vec3.rotateY(this.up, VEC_3_IDENTITY, y, this.up);

    // build axis quaternions
    const qx = quat.fromAxisAngle([1, 0, 0], x);
    const qy = quat.fromAxisAngle([0, 1, 0], y);

    // apply compound rotation quaternion
    const newRotation = quat.mul(qy, qx);
    this.rotation = quat.mul(this.rotation, newRotation);

    // update rotation matrix
    this.rotationMatrix = mat4.fromQuat(this.rotation);

    // const target = vec3.add(this.position, this.forward);
    // this.rotationMatrix = mat4.lookAt(this.position, target, this.up);
  }

  translate(vector: Float32Array) {
    vec3.add(this.position, vector, this.position);
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
