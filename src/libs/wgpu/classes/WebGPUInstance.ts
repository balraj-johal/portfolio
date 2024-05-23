import { API } from "../types";

export interface WebGPUInstanceProperties {
  canvas: HTMLCanvasElement;
}

export class WebGPUInstance {
  private readonly cleanupCallbacks: Array<() => void> = [];

  preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  dpr = Math.min(window.devicePixelRatio, 2);
  currentCanvasDimensions = { width: 0, height: 0 };
  canvas: HTMLCanvasElement;
  rendering = true;
  api?: API;

  constructor(properties: WebGPUInstanceProperties) {
    this.canvas = properties.canvas;
    this.setupCanvas();
    this.setupIntersectionObserver();
  }

  setupCanvas() {
    const { targetWidth, targetHeight } = this.getTargetCanvasSize();

    this.currentCanvasDimensions.width = targetWidth;
    this.canvas.width = targetWidth;
    this.currentCanvasDimensions.height = targetHeight;
    this.canvas.height = targetHeight;
  }

  getTargetCanvasSize() {
    const canvasParent = this.canvas.parentElement;
    if (!canvasParent)
      throw new Error("No canvas parent present to set size from");

    const { clientWidth, clientHeight } = canvasParent;
    return {
      targetWidth: clientWidth * this.dpr,
      targetHeight: clientHeight * this.dpr,
    };
  }

  hasResized() {
    const { targetWidth, targetHeight } = this.getTargetCanvasSize();

    return (
      this.currentCanvasDimensions.width !== targetWidth ||
      this.currentCanvasDimensions.height !== targetHeight
    );
  }

  private setupIntersectionObserver() {
    new IntersectionObserver(
      (event) => {
        if (event[0].isIntersecting) {
          this.rendering = true;
        } else {
          this.rendering = false;
        }
      },
      { threshold: [0] },
    ).observe(this.canvas);
  }

  /** TODO: fix this
   *
   * https://webgpufundamentals.org/webgpu/lessons/webgpu-resizing-the-canvas.html
   * https://eliemichel.github.io/LearnWebGPU/basic-3d-rendering/some-interaction/resizing-window.html
   */

  async initializeContext(
    configuration: Omit<GPUCanvasConfiguration, "device" | "format">,
  ) {
    const api: Partial<API> = {};

    if (navigator.gpu === undefined) {
      return alert("WebGPU is not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No adapter");
    } else {
      api.adapter = adapter;
    }

    const device = await api.adapter.requestDevice();
    if (!device) {
      throw new Error("No device");
    } else {
      api.device = device;
    }

    const context = await this.canvas.getContext("webgpu");
    if (!context) {
      throw new Error("No context");
    } else {
      api.context = context;
    }

    // following assertion is only acceptible as all properties have been checked above
    this.api = api as Required<API>;

    this.configureContext(configuration);
  }

  configureContext(
    configuration: Omit<GPUCanvasConfiguration, "device" | "format">,
  ) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    this.api.context.configure({
      ...configuration,
      format: this.preferredFormat,
      device: this.api.device,
    });
  }

  cleanup() {
    for (const callback of this.cleanupCallbacks) {
      callback();
    }
  }
}
