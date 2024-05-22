import { mat4 } from "gl-matrix";
import { Controller } from "ez_canvas_controller";
import { ArcballCamera } from "arcball_camera";

import WebGPUInstance from "./wgpu";
import shaderCode from "./shader.wgsl";

interface WebGPUExplorationProperties {
  canvas: HTMLCanvasElement;
}

export default class WebGPUExplorationDebug extends WebGPUInstance {
  canvas: HTMLCanvasElement;

  constructor(properties: WebGPUExplorationProperties) {
    super();

    this.canvas = properties.canvas;
    this.setupCanvas();
    this.go();
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

  private async go() {
    // Get a GPU device to render with
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("no adap");

    const device = await adapter.requestDevice();

    // Get a context to display our rendered image on the canvas
    const context = this.canvas.getContext("webgpu");
    if (!context) throw new Error("no context");

    // Setup shader modules
    const shaderModule = device.createShaderModule({ code: shaderCode });
    const compilationInfo = await shaderModule.getCompilationInfo();
    if (compilationInfo.messages.length > 0) {
      let hadError = false;
      console.log("Shader compilation log:");
      for (let i = 0; i < compilationInfo.messages.length; ++i) {
        const msg = compilationInfo.messages[i];
        console.log(`${msg.lineNum}:${msg.linePos} - ${msg.message}`);
        hadError = hadError || msg.type == "error";
      }
      if (hadError) {
        console.log("Shader failed to compile");
        return;
      }
    }

    // Specify vertex data
    // Allocate room for the vertex data: 3 vertices, each with 2 float4's
    const dataBuf = device.createBuffer({
      size: 3 * 2 * 4 * 4,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });

    // Interleaved positions and colors
    new Float32Array(dataBuf.getMappedRange()).set([
      1,
      -1,
      0,
      1, // position
      1,
      0,
      0,
      1, // color
      -1,
      -1,
      0,
      1, // position
      0,
      1,
      0,
      1, // color
      0,
      1,
      0,
      1, // position
      0,
      0,
      1,
      1, // color
    ]);
    dataBuf.unmap();

    // Vertex attribute state and shader stage
    const vertexState = {
      // Shader stage info
      module: shaderModule,
      entryPoint: "vertex_main",
      // Vertex buffer info
      buffers: [
        {
          arrayStride: 2 * 4 * 4,
          attributes: [
            {
              format: "float32x4" as GPUVertexFormat,
              offset: 0,
              shaderLocation: 0,
            },
            {
              format: "float32x4" as GPUVertexFormat,
              offset: 4 * 4,
              shaderLocation: 1,
            },
          ],
        },
      ],
    };

    // Setup render outputs
    const swapChainFormat = "bgra8unorm" as GPUTextureFormat;
    context.configure({
      device: device,
      format: swapChainFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const depthFormat = "depth24plus-stencil8" as GPUTextureFormat;
    const depthTexture = device.createTexture({
      size: {
        width: this.canvas.width,
        height: this.canvas.height,
        depthOrArrayLayers: 1,
      },
      format: depthFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const fragmentState = {
      // Shader info
      module: shaderModule,
      entryPoint: "fragment_main",
      // Output render target info
      targets: [{ format: swapChainFormat }],
    };

    // Create bind group layout
    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" },
        },
      ],
    });

    // Create render pipeline
    const layout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    const renderPipeline = device.createRenderPipeline({
      layout: layout,
      vertex: vertexState,
      fragment: fragmentState,
      depthStencil: {
        format: depthFormat,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });

    const renderPassDesc = {
      colorAttachments: [
        {
          view: null as unknown as GPUTextureView,
          loadOp: "clear" as GPULoadOp,
          clearValue: [0.3, 0.3, 0.3, 1],
          storeOp: "store" as GPUStoreOp,
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthLoadOp: "clear" as GPULoadOp,
        depthClearValue: 1.0,
        depthStoreOp: "store" as GPUStoreOp,
        stencilLoadOp: "clear" as GPULoadOp,
        stencilClearValue: 0,
        stencilStoreOp: "store" as GPUStoreOp,
      },
    };

    // Create a buffer to store the view parameters
    const viewParamsBuffer = device.createBuffer({
      size: 16 * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const viewParamBG = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParamsBuffer } }],
    });

    const camera = new ArcballCamera([0, 0, 3], [0, 0, 0], [0, 1, 0], 0.5, [
      this.canvas.width,
      this.canvas.height,
    ]);
    const proj = mat4.perspective(
      mat4.create(),
      (50 * Math.PI) / 180.0,
      this.canvas.width / this.canvas.height,
      0.1,
      100,
    );
    let projView = mat4.create();

    // Register mouse and touch listeners
    const controller = new Controller();
    controller.mousemove = function (
      prev: Array<number>,
      cur: Array<number>,
      evt: MouseEvent,
    ) {
      if (evt.buttons == 1) {
        camera.rotate(prev, cur);
      } else if (evt.buttons == 2) {
        camera.pan([cur[0] - prev[0], prev[1] - cur[1]]);
      }
    };
    controller.wheel = function (amt: number) {
      camera.zoom(amt);
    };
    controller.pinch = controller.wheel;
    controller.twoFingerDrag = function (drag: number) {
      camera.pan(drag);
    };
    controller.registerForCanvas(this.canvas);

    // Render!
    const render = () => {
      // Update camera buffer
      projView = mat4.mul(projView, proj, camera.camera);

      const upload = device.createBuffer({
        size: 16 * 4,
        usage: GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true,
      });
      {
        const map = new Float32Array(upload.getMappedRange());
        map.set(projView);
        upload.unmap();
      }

      renderPassDesc.colorAttachments[0].view = context
        .getCurrentTexture()
        .createView();

      const commandEncoder = device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(upload, 0, viewParamsBuffer, 0, 16 * 4);

      const renderPass = commandEncoder.beginRenderPass(renderPassDesc);

      renderPass.setPipeline(renderPipeline);
      renderPass.setBindGroup(0, viewParamBG);
      renderPass.setVertexBuffer(0, dataBuf);
      renderPass.draw(3, 1, 0, 0);

      renderPass.end();
      device.queue.submit([commandEncoder.finish()]);
      upload.destroy();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}
