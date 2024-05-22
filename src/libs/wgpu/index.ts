import { mat4 } from "gl-matrix";
import { Controller } from "ez_canvas_controller";
import { ArcballCamera } from "arcball_camera";

import WebGPUInstance from "./wgpu";
import { checkShaderModuleCompilation } from "./utils";
import { API } from "./types";
import Triangle from "./triangle";
import shader from "./shader.wgsl";

export const FLOAT_LENGTH = 4;
const SWAP_CHAIN_TEXTURE_FORMAT: GPUTextureFormat = "bgra8unorm";
const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

interface WebGPUExplorationProperties {
  canvas: HTMLCanvasElement;
}

export default class WebGPUExploration extends WebGPUInstance {
  canvas: HTMLCanvasElement;

  api?: API;
  shaderModule?: GPUShaderModule;
  rendering = true;

  private camera;
  private cameraProjection = mat4.create();
  private cameraProjectionView = mat4.create();

  constructor(properties: WebGPUExplorationProperties) {
    super();

    this.canvas = properties.canvas;
    this.setupCanvas();
    this.setupIntersectionObserver();
    this.camera = this.buildCamera();
  }

  // checked
  private setupCanvas() {
    const canvasParent = this.canvas.parentElement;
    if (!canvasParent)
      throw new Error("No canvas parent present to set size from");

    const { clientWidth, clientHeight } = canvasParent;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
  }

  // checked
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

  // checked
  private buildCamera() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create an Arcball camera and view projection matrix
    const camera = new ArcballCamera([0, 0, 3], [0, 0, 0], [0, 1, 0], 0.5, [
      width,
      height,
    ]);

    // Create a perspective projection matrix
    this.cameraProjection = mat4.perspective(
      mat4.create(),
      (50 * Math.PI) / 180.0,
      width / height,
      0.1,
      100,
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

    return camera;
  }

  private updateCameraBuffer() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    this.cameraProjectionView = mat4.mul(
      this.cameraProjectionView,
      this.cameraProjection,
      this.camera.camera,
    );

    const upload = this.api.device.createBuffer({
      size: 16 * FLOAT_LENGTH,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    {
      const map = new Float32Array(upload.getMappedRange());
      map.set(this.cameraProjectionView);
      upload.unmap();
    }

    return upload;
  }

  private createCameraBuffer() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return this.api.device.createBuffer({
      size: 16 * FLOAT_LENGTH,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  // checked
  async initializeContext() {
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

    api.context.configure({
      device: api.device,
      format: SWAP_CHAIN_TEXTURE_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // following assertion is only acceptible as all properties have been checked above
    this.api = api as Required<API>;
  }

  /**
   * Defines the connection between vertexinput buffers and the shader itself.
   *
   * i.e., stuff like what format each input is in, how to parse the inputs, which location
   */
  // checked
  private createVertexState(shaderModule: GPUShaderModule): GPUVertexState {
    // defines the properties of the two interleaved attributes
    const positionAttribute: GPUVertexAttribute = {
      format: "float32x4",
      offset: 0,
      shaderLocation: 0,
    };
    const colorAttribute: GPUVertexAttribute = {
      format: "float32x4",
      offset: 4 * FLOAT_LENGTH, // offset after 1 float 4
      shaderLocation: 1,
    };

    const bufferLayout: GPUVertexBufferLayout = {
      arrayStride: 2 * 4 * FLOAT_LENGTH, // 2 float 4's
      attributes: [positionAttribute, colorAttribute],
    };

    return {
      module: shaderModule,
      entryPoint: "vertex_main", // Name of the vertex module defined in shader
      buffers: [bufferLayout],
    };
  }

  /**
   * Defines the connection between fragment output buffers and the shader itself.
   *
   * i.e., stuff like what format each input is in, how to parse the inputs, which location.
   *
   * NOTE: We're rendering directly to the swap chain.
   */
  private createFragmentState(shaderModule: GPUShaderModule): GPUFragmentState {
    const target: GPUColorTargetState = {
      format: SWAP_CHAIN_TEXTURE_FORMAT,
    };

    return {
      module: shaderModule,
      entryPoint: "fragment_main", // Name of the fragment module defined in shader
      targets: [target], // NOTE: here's where MRT would be configured I think
    };
  }

  // checked
  private async newShaderModule(shader: string) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    const shaderModule = this.api.device.createShaderModule({ code: shader });
    await checkShaderModuleCompilation(shaderModule);

    return shaderModule;
  }

  // checked
  private createBindGroupLayout() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return this.api.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" },
        },
      ],
    });
  }

  // checked
  // TODO: create depth and stencil texture?
  private createDepthTexture() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return this.api.device.createTexture({
      size: {
        width: this.canvas.width,
        height: this.canvas.height,
        depthOrArrayLayers: 1,
      },
      format: DEPTH_TEXTURE_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  // checked
  private async createRenderPipeline(
    pipelineLayout: GPUPipelineLayout,
    vertexState: GPUVertexState,
    fragmentState: GPUFragmentState,
  ) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return await this.api.device.createRenderPipelineAsync({
      layout: pipelineLayout,
      vertex: vertexState,
      fragment: fragmentState,
      depthStencil: {
        format: DEPTH_TEXTURE_FORMAT,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });
  }

  /** WTF */
  private createRenderPassDescription(
    api: API,
    depthTexture: GPUTexture,
  ): GPURenderPassDescriptor {
    const colorAttachment: GPURenderPassColorAttachment = {
      // view will be updated to the current render target each frame
      view: null as unknown as GPUTextureView,
      loadOp: "clear",
      clearValue: [0.3, 0.3, 0.3, 1],
      storeOp: "store",
    };
    const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
      // view will be set to the current render target each frame
      view: depthTexture.createView(),
      depthLoadOp: "clear",
      depthClearValue: 1.0,
      depthStoreOp: "store",
      stencilLoadOp: "clear",
      stencilClearValue: 0,
      stencilStoreOp: "store",
    };

    return {
      colorAttachments: [colorAttachment],
      depthStencilAttachment,
    };
  }

  async initialize() {
    await this.initializeContext();
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    this.shaderModule = await this.newShaderModule(shader);

    const vertexState = this.createVertexState(this.shaderModule);
    const fragmentState = this.createFragmentState(this.shaderModule);
    const depthTexture = this.createDepthTexture();
    const bindGroupLayout = this.createBindGroupLayout();
    const renderPipelineLayout = this.api.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });
    const renderPipeline = await this.createRenderPipeline(
      renderPipelineLayout,
      vertexState,
      fragmentState,
    );

    const triangle = new Triangle(this.api);

    // Render Pass!
    const renderPassDescription = this.createRenderPassDescription(
      this.api,
      depthTexture,
    );

    const viewParametersBuffer = this.createCameraBuffer();
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    const render = () => {
      if (!this.api) {
        throw new Error("No WebGPU API ready");
      }

      const cameraBuffer = this.updateCameraBuffer();

      const firstColorAttachment = [
        ...renderPassDescription.colorAttachments,
      ][0];

      if (firstColorAttachment != null) {
        firstColorAttachment.view = this.api.context
          .getCurrentTexture()
          .createView();
      }

      const commandEncoder = this.api.device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(
        cameraBuffer,
        0,
        viewParametersBuffer,
        0,
        16 * FLOAT_LENGTH,
      );

      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
      renderPass.setPipeline(renderPipeline);
      renderPass.setBindGroup(0, viewParameterBindGroup);

      if (triangle.dataBuffer) {
        renderPass.setVertexBuffer(0, triangle.dataBuffer);
        renderPass.draw(3, 1, 0, 0);
      }

      renderPass.end();
      this.api.device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}
