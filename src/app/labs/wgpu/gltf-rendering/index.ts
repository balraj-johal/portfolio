import GUI from "lil-gui";
import { vec3 } from "gl-matrix";

import { uploadGlb } from "@/libs/wgpu/classes/gltf";
import { alignTo, FLOAT_LENGTH_BYTES } from "@/libs/wgpu";
import {
  checkShaderModuleCompilation,
  WebGPUInstance,
  Camera,
  WebGPUInstanceProperties,
} from "@/libs/wgpu";

import phongShader from "./shaders/gltf-phong.wgsl";
import shader from "./shaders/gltf-default.wgsl";

const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

enum Model {
  AVOCADO = "/assets/avocado.glb",
  ENGINE = "/assets/2CylinderEngine.glb",
  DUCKY = "/assets/ducky.glb",
}

const SHADERS = {
  default: shader,
  phong: phongShader,
};

interface WebGPUExplorationProperties extends WebGPUInstanceProperties {}

export default class WebGPUExplorationGLTF extends WebGPUInstance {
  shaderModule?: GPUShaderModule;
  depthStencilTexture?: GPUTexture;

  private camera;
  private lightingConfig = {
    lightPosition: { x: 1, y: 1, z: 1 },
  };

  constructor(properties: WebGPUExplorationProperties) {
    super(properties);

    this.camera = new Camera({
      canvas: this.canvas,
      initialPosition: [0, 0, 5],
      nearPlane: 0.01,
      farPlane: 10,
    });

    const gui = new GUI();
    gui.add(this.lightingConfig.lightPosition, "x");
    gui.add(this.lightingConfig.lightPosition, "y");
    gui.add(this.lightingConfig.lightPosition, "z");
    gui.onChange((e) => console.log(e));
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

  private createViewParametersBindGroup() {
    if (!this.api) throw new Error("No WebGPU API ready");

    const viewParameterBindGroupLayout = this.api.device.createBindGroupLayout({
      label: "view parameters bind group layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" },
        },
      ],
    });
    const viewParametersBuffer = this.camera.createBuffer(this.api);
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: viewParameterBindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    return {
      viewParametersBuffer,
      viewParameterBindGroup,
      viewParameterBindGroupLayout,
    };
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

  async start() {
    await this.initializeContext({ usage: GPUTextureUsage.RENDER_ATTACHMENT });
    if (!this.api) throw new Error("No WebGPU API ready");

    this.shaderModule = await this.newShaderModule(SHADERS.phong);
    this.depthStencilTexture = this.createDepthStencilTexture();
    let renderPassDescription = this.createRenderPassDescription(
      this.depthStencilTexture,
    );

    // create view parameters
    const {
      viewParameterBindGroup,
      viewParameterBindGroupLayout,
      viewParametersBuffer,
    } = this.createViewParametersBindGroup();

    // create lighting uniforms
    const lightingBindGroupLayout = this.api.device.createBindGroupLayout({
      label: "lighting bind group layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" },
        },
      ],
    });
    const lightingBuffer = this.api.device.createBuffer({
      size: alignTo(3 * FLOAT_LENGTH_BYTES, 16),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const lightingBindGroup = this.api.device.createBindGroup({
      layout: lightingBindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: lightingBuffer } }],
    });

    // load and process model
    const res = await fetch(Model.DUCKY);
    const modelBuffer = await res.arrayBuffer();
    const scene = await uploadGlb(modelBuffer, this.api);

    // build model render pipeline
    await scene.buildRenderPipelines({
      api: this.api,
      shaderModule: this.shaderModule,
      colorFormat: this.preferredFormat,
      depthFormat: DEPTH_TEXTURE_FORMAT,
      uniformsBindGroupLayout: viewParameterBindGroupLayout,
      lightingBindGroupLayout,
    });

    const render = () => {
      if (!this.api) throw new Error("No WebGPU API ready");

      // ---- HANDLE RESIZE

      if (this.hasResized()) {
        this.setupCanvas();
        this.camera.reproject();

        // destroy and recreate depth/stencil texture
        this.depthStencilTexture?.destroy();
        this.depthStencilTexture = this.createDepthStencilTexture();
        renderPassDescription = this.createRenderPassDescription(
          this.depthStencilTexture,
        );

        // reconfigure webgpu context with correct size
        this.configureContext({ usage: GPUTextureUsage.RENDER_ATTACHMENT });
      }

      // Update the main colour attachment's contents with the next
      // available texture in the swap chain.
      //
      // The colour attachment itself is updated, so the render pass
      // description can be reused rather than recreated each time for no reason
      const colorAttachments = [...renderPassDescription.colorAttachments];
      const firstColorAttachment = colorAttachments[0];
      if (firstColorAttachment != null) {
        firstColorAttachment.view = this.api.context
          .getCurrentTexture()
          .createView();
      }

      // prep the commmand encoder
      const commandEncoder = this.api.device.createCommandEncoder();

      // ---- UPDATE BUFFERS HERE

      // copy the contents of the updated camera buffer into the
      // view parameters uniform buffer
      const cameraTransferBuffer = this.camera.getUpdatedBuffer(this.api);
      commandEncoder.copyBufferToBuffer(
        cameraTransferBuffer,
        0,
        viewParametersBuffer,
        0,
        (16 + 4) * FLOAT_LENGTH_BYTES,
      );

      // copy the contents of the updated lighting buffer into the
      // view parameters uniform buffer
      const newLightingBuffer = this.api.device.createBuffer({
        size: alignTo(3 * FLOAT_LENGTH_BYTES, 16),
        usage: GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true,
      });
      const map = new Float32Array(newLightingBuffer.getMappedRange());
      const lightingVec3 = vec3.create();
      lightingVec3[0] = this.lightingConfig.lightPosition.x;
      lightingVec3[1] = this.lightingConfig.lightPosition.y;
      lightingVec3[2] = this.lightingConfig.lightPosition.z;
      map.set(lightingVec3);
      newLightingBuffer.unmap();
      commandEncoder.copyBufferToBuffer(
        newLightingBuffer,
        0,
        lightingBuffer,
        0,
        alignTo(3 * FLOAT_LENGTH_BYTES, 16),
      );

      // ---- RENDER PASS

      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
      renderPass.label = "index.ts gltf-rendering render pass";
      renderPass.setBindGroup(3, lightingBindGroup);

      scene.render({
        renderPassEncoder: renderPass,
        uniformsBindGroup: viewParameterBindGroup,
      });

      renderPass.end();

      // ---- END RENDER PASS

      // submit commands to GPU to render
      this.api.device.queue.submit([commandEncoder.finish()]);

      cameraTransferBuffer.destroy();

      // request render of next frame
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}
