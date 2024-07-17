import { mat4 } from "gl-matrix";
import { Controller } from "ez_canvas_controller";
import { ArcballCamera } from "arcball_camera";

import { FLOAT_LENGTH_BYTES } from "../utils/math";
import { WebGpuApi } from "../types";

interface CameraProperties {
  canvas: HTMLCanvasElement;
  initialPosition?: [number, number, number];
  nearPlane?: number;
  farPlane?: number;
}

export class Camera {
  canvas: HTMLCanvasElement;
  camera: unknown;

  private cameraProjection = mat4.create();
  private cameraProjectionView = mat4.create();
  private properties: CameraProperties;

  constructor(properties: CameraProperties) {
    this.canvas = properties.canvas;
    this.properties = properties;

    this.build(properties);
  }

  private build(properties: CameraProperties) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    const initialPosition = properties.initialPosition ?? [0, 0, 3];
    const nearPlane = properties.nearPlane ?? 0.1;
    const farPlane = properties.farPlane ?? 100;

    // Create an Arcball camera and view projection matrix
    const camera = new ArcballCamera(
      initialPosition,
      [0, 0, 0],
      [0, 1, 0],
      0.5,
      [width, height],
    );

    // Create a perspective projection matrix
    this.cameraProjection = mat4.perspective(
      mat4.create(),
      (50 * Math.PI) / 180.0,
      width / height,
      nearPlane,
      farPlane,
    );

    // Matrix which will store the computed projection * view matrix
    this.cameraProjectionView = mat4.create();

    // Controller utility for interacting with the canvas and driving the Arcball camera
    const controller = new Controller();
    controller.mousemove = function (
      previous: number[],
      current: number[],
      event: MouseEvent,
    ) {
      if (event.buttons == 1) {
        camera.rotate(previous, current);
      } else if (event.buttons == 2) {
        camera.pan([current[0] - previous[0], previous[1] - current[1]]);
      }
    };
    controller.wheel = function (amount: number) {
      camera.zoom(amount * 0.5);
    };
    controller.registerForCanvas(this.canvas);

    this.camera = camera;
  }

  reproject() {
    // TODO: this is really laggy and shit.
    // I reckon I need to learn how to build a camera controller from scratch,
    // and give that new version a native reprojection function.
    this.build(this.properties);
  }

  createBuffer(api: WebGpuApi) {
    return api.device.createBuffer({
      size: 16 * FLOAT_LENGTH_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  getUpdatedBuffer(api: WebGpuApi) {
    this.cameraProjectionView = mat4.mul(
      this.cameraProjectionView,
      this.cameraProjection,
      // @ts-expect-error ArcballCamera is untyped
      this.camera.camera,
    );

    const upload = api.device.createBuffer({
      size: 16 * FLOAT_LENGTH_BYTES,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });

    const map = new Float32Array(upload.getMappedRange());
    map.set(this.cameraProjectionView);
    upload.unmap();

    return upload;
  }
}
