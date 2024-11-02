import { alignTo, createShaderModule, FLOAT_LENGTH_BYTES } from "@/libs/wgpu";
import { WebGPUInstance, WebGPUInstanceProperties } from "@/libs/wgpu";

import { getComputeShader } from "./shaders";

type WebGPUExplorationProperties = WebGPUInstanceProperties;

const COMPUTE_INPUT = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// function calculateWorkgroupSize(inputLength: number) {
//   // const WORKGROUP_SIZE_MAX = [64, 32, 32]; // TODO: check if this is reasonable
//   const WORKGROUP_SIZE_MAX = [4, 4, 4]; // NOTE: Temp values
// }

// TODO: get this data into a vertex buffer, which is then rendered.

const NUMBER_VERTICES_MAX = 4;
const NUMBER_INDICES_MAX = 6;

const INDICES = [
  0,
  1,
  3, // Tri 1
  1,
  3,
  2, // Tri 2
];

export default class WebGPUExplorationCompute extends WebGPUInstance {
  constructor(properties: WebGPUExplorationProperties) {
    super(properties);
  }

  async start() {
    await this.initializeContext({ usage: GPUTextureUsage.RENDER_ATTACHMENT });
    if (!this.api) throw new Error("No WebGPU API ready");

    const computeShader = getComputeShader([64, 1, 1]);

    const computeShaderModule = await createShaderModule(this.api, {
      label: "compute test",
      code: computeShader,
    });

    const computePipeline = this.api.device.createComputePipeline({
      label: "processing input data pipeline",
      layout: "auto",
      compute: {
        module: computeShaderModule,
        entryPoint: "processInputData",
      },
    });

    const computeInput = this.api.device.createBuffer({
      label: "input data buffer",
      size: alignTo(COMPUTE_INPUT.byteLength, FLOAT_LENGTH_BYTES),
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    this.api.device.queue.writeBuffer(computeInput, 0, COMPUTE_INPUT);

    const outputLength =
      (NUMBER_VERTICES_MAX * 3 + // 3 floats for vector
        NUMBER_INDICES_MAX) *
      FLOAT_LENGTH_BYTES;

    const computeOutput = this.api.device.createBuffer({
      label: "output data buffer",
      size: alignTo(outputLength, FLOAT_LENGTH_BYTES),
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const computeBindGroup = this.api.device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: computeInput } },
        { binding: 1, resource: { buffer: computeOutput } },
      ],
    });

    const computeResults = this.api.device.createBuffer({
      label: "read results data buffer",
      size: alignTo(outputLength, FLOAT_LENGTH_BYTES),
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    const performComputePass = (commandEncoder: GPUCommandEncoder) => {
      const computePass = commandEncoder.beginComputePass({
        label: "compute pass",
      });
      computePass.setPipeline(computePipeline);
      computePass.setBindGroup(0, computeBindGroup);
      computePass.dispatchWorkgroups(COMPUTE_INPUT.length);

      // NOTE: compute pass must be ended before processing results, duh
      computePass.end();

      commandEncoder.copyBufferToBuffer(
        computeOutput,
        0,
        computeResults,
        0,
        computeResults.size,
      );
    };

    const render = async () => {
      if (!this.api) throw new Error("No WebGPU API ready");

      // prep the commmand encoder
      const commandEncoder = this.api.device.createCommandEncoder();

      performComputePass(commandEncoder);

      // submit commands to GPU to render
      this.api.device.queue.submit([commandEncoder.finish()]);

      // request render of next frame
      requestAnimationFrame(render);

      await computeResults.mapAsync(GPUMapMode.READ);
      const range = computeResults.getMappedRange();
      const result = new Float32Array(range).slice(0, 12);
      computeResults.unmap();
      console.log(result);
    };

    requestAnimationFrame(render);
  }
}
