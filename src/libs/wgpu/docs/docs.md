# Data Buffers

## Mapping

Mapping is kinda like declaring current ownership of a buffer. If a buffer is unmapped, the GPU owns it. If it is mapped, the CPU owns it. Owning it here means being able to read/write to it.

A GPU Buffer's contents is usually hidden from the CPU. To make it visible, the buffer must be "mapped". I think the buffer being visible to the CPU allows the CPU to write to it.

### Why unmap the buffer?

I think the buffer being unmapped allows the GPU to hide it again, so it can optimise its memory usage better.

### buffer.getMappedRange()

[DOCS](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/getMappedRange)

This returns an ArrayBuffer with the contents of the mapped buffer in it. This can then be written to.

# Swap Chain

A swap chain allows for smooth, possibly vSync'd, rendering to the screen, by queing up fully rendered frames. Once a frame has been rendered, the swap chain then outputs that frame to the screen, while the next frame is being rendered to one of the other frameBuffers in the chain.

Essentially, the swap chain is a list of frameBuffers that ping-pong/swap their rendering and then display on screen. This means only fully rendered frames get shown, mitigating issues like screen tearing etc.

# What does texture.createView do?

Think returns a specific view or section of the resource defined in the texture.

# Why do we need to update the color attachment's view each frame?

# What the fuck are the rest of the attachment config options?

# What is a command queue?

https://eliemichel.github.io/LearnWebGPU/getting-started/the-command-queue.html

A command queue is used to batch the dispatched instructions from the CPU (which is the content timeline), then send then to the GPU (which is the queue timeline).

# What is a command encoder?

A command encode is used to ensode instructions into the command queue.

# Why does it need to get created and binned each frame?

I think this is the nature of wgpu, quick and throw away create and destroys

# Uniform Buffers vs Storage Buffers

Uniform buffers are used to store small to medium size buffers of constant data to shaders, whereas storage buffers are for large or shader writable data buffers.

# Bind groups

A bind group is a way to bundle together various resources so that they can be easily and efficiently accessed by shaders during GPU operations. The bind group layout defines the structure, the bind group itself holds the actual resources, and shaders use these resources as defined by the layout.
