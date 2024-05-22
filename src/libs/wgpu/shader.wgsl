struct VertexInput {
  @location(0) position: vec4<f32>,
  @location(1) color: vec4<f32>
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>
}

// //TODO: maybe better named Uniform Buffer Layout? or Bind Group Layout?
struct ViewParameters {
  view_projection: mat4x4<f32>
}

@group(0) @binding(0)
var<uniform> view_parameters: ViewParameters;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
  var out: VertexOutput;

  out.position = view_parameters.view_projection * vert.position;
  out.color = vert.color;

  return out;
}

struct FragmentOutput {
  @location(0) color: vec4<f32>
}

@fragment
fn fragment_main(in: VertexOutput) -> FragmentOutput {
  var out: FragmentOutput;
  out.color = in.color;

  return out;
}
