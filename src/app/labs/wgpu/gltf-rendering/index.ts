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

enum Model {
  AVOCADO = "/assets/avocado.glb",
  ENGINE = "/assets/2CylinderEngine.glb",
}

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
      nearPlane: 0.0001,
      farPlane: 500,
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

  private createViewParametersBindGroupLayout() {
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
      // on load the attachment is cleared
      loadOp: "clear",
      // with the following clear colour (rgba)
      clearValue: [0.3, 0.3, 0.3, 1],
      // and then on completion of the render pass, the result is
      // stored into this attachment
      storeOp: "store",
    };

    const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
      // view will be set to the current render target each frame
      view: depthStencilTexture.createView(),
      // each run of the render pass, the depth texture is cleared
      depthLoadOp: "clear",
      // with a completely white colour
      depthClearValue: 1.0,
      // and once the render pass has completed, the result is stored into the depth texture
      depthStoreOp: "store",
      // then the pass moves onto the stencil data
      stencilLoadOp: "clear",
      // which is cleared with total black
      stencilClearValue: 0,
      // and again, once the pass has completed, the output is stored into
      // this attachment
      stencilStoreOp: "store",
    };

    return {
      colorAttachments: [colorAttachment],
      depthStencilAttachment,
    };
  }

  /** On resize, each texture needs to be destroyed and recreated. */
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

    // create view parameters
    const viewParameterBindGroupLayout =
      this.createViewParametersBindGroupLayout();
    const viewParametersBuffer = this.camera.createBuffer(this.api);
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: viewParameterBindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    const res = await fetch(Model.AVOCADO);
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
          uniformsBindGroupLayout: viewParameterBindGroupLayout,
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

      // Update the main colour attachment's contents with the next
      // available texture in the swap chain.
      //
      // The colour attachment itself is updated, so the render pass
      // description can be reused rather than recreated each time for no reason
      const firstColorAttachment = [
        ...renderPassDescription.colorAttachments,
      ][0];
      if (firstColorAttachment != null) {
        firstColorAttachment.view = this.api.context
          .getCurrentTexture()
          .createView();
      }

      // prep the commmand encoder
      const commandEncoder = this.api.device.createCommandEncoder();

      // copy the contents of the updated camera buffer into the
      // view parameters uniform buffer
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
