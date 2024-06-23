export async function checkShaderModuleCompilation(module: GPUShaderModule) {
  const info = await module.getCompilationInfo();
  let errored = false;

  if (info.messages.length) {
    for (const message of info.messages) {
      if (message.type === "error") errored = true;
    }
  }

  if (errored) {
    console.error("Shader compilation failed.");
  } else {
    console.log("Shader compilation succeeded.");
  }
}
