import { checkShaderModuleCompilation } from "./utils";
import { API } from "./types";
import Triangle from "./triangle";
import shader from "./shader.wgsl";

const FLOAT_LENGTH = 4;
const SWAP_CHAIN_TEXTURE_FORMAT: GPUTextureFormat = "bgra8unorm";
const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

export default class WebGPUExploration {
  canvas: HTMLCanvasElement;

  api?: API;
  shaderModule?: GPUShaderModule;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

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

  private async newShaderModule(shader: string) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    const shaderModule = this.api.device.createShaderModule({ code: shader });
    await checkShaderModuleCompilation(shaderModule);

    return shaderModule;
  }

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

  private async createRenderPipeline(
    vertexState: GPUVertexState,
    fragmentState: GPUFragmentState,
  ) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    const pipelineLayout = this.api.device.createPipelineLayout({
      bindGroupLayouts: [], // Not using any shader layouts so I think that why this is empty?
    });

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
      view: api.context.getCurrentTexture().createView(),
      loadOp: "clear",
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
    const renderPipeline = await this.createRenderPipeline(
      vertexState,
      fragmentState,
    );

    const triangle = new Triangle(this.api);

    // Render Pass!
    const renderPassDescription = this.createRenderPassDescription(
      this.api,
      depthTexture,
    );

    const render = () => {
      if (!this.api) {
        throw new Error("No WebGPU API ready");
      }
      const firstColorAttachment = [
        ...renderPassDescription.colorAttachments,
      ][0];

      if (firstColorAttachment != null) {
        firstColorAttachment.view = this.api.context
          .getCurrentTexture()
          .createView();
      }

      const commandEncoder = this.api.device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
      renderPass.setPipeline(renderPipeline);

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
