struct VertexInput {
  @location(0) position: vec4<f32>,
  @location(1) color: vec4<f32>
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>
}

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
  var out: VertexOutput;
  out.position = vert.position;
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