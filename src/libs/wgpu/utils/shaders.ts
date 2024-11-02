import type { WebGpuApi } from "../types";

export async function checkShaderModuleCompilation(module: GPUShaderModule) {
  const info = await module.getCompilationInfo();

  // check compilation info for any error messages
  let errored = false;
  if (info.messages.length) {
    for (const message of info.messages) {
      if (message.type === "error") errored = true;
    }
  }

  // if any, log errors
  if (errored) {
    return console.error("Shader compilation failed, ", info.messages);
  }

  // otherwise log success
  if (module.label) {
    console.log(`Shader compilation succeeded for ${module.label}`);
  } else {
    console.log("Shader compilation succeeded.");
  }
}

export async function createShaderModule(
  api: WebGpuApi,
  descriptor: GPUShaderModuleDescriptor,
) {
  const shaderModule = api.device.createShaderModule(descriptor);
  await checkShaderModuleCompilation(shaderModule);

  return shaderModule;
}
