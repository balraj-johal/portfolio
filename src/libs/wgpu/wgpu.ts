import { API } from "./types";

export interface WebGPUInstanceProperties {
  canvas: HTMLCanvasElement;
}

export default class WebGPUInstance {
  canvas: HTMLCanvasElement;
  rendering = true;

  api?: API;

  constructor(properties: WebGPUInstanceProperties) {
    this.canvas = properties.canvas;
    this.setupCanvas();
    this.setupIntersectionObserver();
  }

  private setupCanvas() {
    const canvasParent = this.canvas.parentElement;
    if (!canvasParent)
      throw new Error("No canvas parent present to set size from");

    const { clientWidth, clientHeight } = canvasParent;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
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

  async initializeContext(
    configuration: Omit<GPUCanvasConfiguration, "device">,
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

    api.context.configure({ ...configuration, device: device });

    // following assertion is only acceptible as all properties have been checked above
    this.api = api as Required<API>;
  }
}
