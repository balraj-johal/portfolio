import { uploadGlb } from "@/libs/wgpu/classes/gltf";
import { FLOAT_LENGTH_BYTES } from "@/libs/wgpu";
import {
  checkShaderModuleCompilation,
  WebGPUInstance,
  Camera,
  WebGPUInstanceProperties,
} from "@/libs/wgpu";

import shader from "./shaders/shader.wgsl";

const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

const AVOCADO_FILE_PATH = "/assets/avocado.glb";

interface WebGPUExplorationProperties extends WebGPUInstanceProperties {}

export default class WebGPUExplorationGLTF extends WebGPUInstance {
  shaderModule?: GPUShaderModule;
  depthStencilTexture?: GPUTexture;

  private camera;

  constructor(properties: WebGPUExplorationProperties) {
    super(properties);

    this.camera = new Camera({
      canvas: this.canvas,
      initialPosition: [0, 0, 0.25],
    });
  }

  private async newShaderModule(shader: string) {
    if (!this.api) throw new Error("No WebGPU API ready");

    const shaderModule = this.api.device.createShaderModule({
      code: shader,
      label: "gltf-shader",
    });
    await checkShaderModuleCompilation(shaderModule);

    return shaderModule;
  }

  private createBindGroupLayout() {
    if (!this.api) throw new Error("No WebGPU API ready");

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

  private createDepthStencilTexture() {
    if (!this.api) throw new Error("No WebGPU API ready");

    return this.api.device.createTexture({
      size: {
        width: this.currentCanvasDimensions.width,
        height: this.currentCanvasDimensions.height,
        depthOrArrayLayers: 1,
      },
      format: DEPTH_TEXTURE_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  /** TODO: explain */
  private createRenderPassDescription(
    depthStencilTexture: GPUTexture,
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
      view: depthStencilTexture.createView(),
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

  handleWindowResize() {
    this.depthStencilTexture = this.createDepthStencilTexture();
  }

  async start() {
    await this.initializeContext({ usage: GPUTextureUsage.RENDER_ATTACHMENT });
    if (!this.api) throw new Error("No WebGPU API ready");

    this.shaderModule = await this.newShaderModule(shader);
    this.depthStencilTexture = this.createDepthStencilTexture();
    let renderPassDescription = this.createRenderPassDescription(
      this.depthStencilTexture,
    );

    const bindGroupLayout = this.createBindGroupLayout();

    // create view parameters
    const viewParametersBuffer = this.camera.createBuffer(this.api);
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    const res = await fetch(AVOCADO_FILE_PATH);
    const meshBuffer = await res.arrayBuffer();
    const meshes = uploadGlb(meshBuffer, this.api.device);

    const buildMeshRenderPipelinePromises: Promise<void>[] = [];
    for (const mesh of meshes) {
      buildMeshRenderPipelinePromises.push(
        mesh.buildRenderPipeline({
          api: this.api,
          shaderModule: this.shaderModule,
          colorFormat: this.preferredFormat,
          depthFormat: DEPTH_TEXTURE_FORMAT,
          uniformsBindGroupLayout: bindGroupLayout,
        }),
      );
    }
    await Promise.all(buildMeshRenderPipelinePromises);

    const render = () => {
      if (!this.api) throw new Error("No WebGPU API ready");

      // update camera buffers  to passas uniforms
      const cameraBuffer = this.camera.getUpdatedBuffer(this.api);

      // on resize
      if (this.hasResized()) {
        this.setupCanvas();

        // destroy and recreate depth/stencil texture
        this.depthStencilTexture?.destroy();
        this.depthStencilTexture = this.createDepthStencilTexture();
        renderPassDescription = this.createRenderPassDescription(
          this.depthStencilTexture,
        );

        // reconfigure webgpu context with correct size
        this.configureContext({
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
      }

      // TODO:: properly figure out what this does
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
        16 * FLOAT_LENGTH_BYTES,
      );

      // start render pass
      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);

      for (const mesh of meshes) {
        mesh.render({
          renderPassEncoder: renderPass,
          uniformsBindGroup: viewParameterBindGroup,
        });
      }

      // end render pass
      renderPass.end();

      // submit commands to GPU to render
      this.api.device.queue.submit([commandEncoder.finish()]);

      cameraBuffer.destroy();

      // request render of next frame
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}
