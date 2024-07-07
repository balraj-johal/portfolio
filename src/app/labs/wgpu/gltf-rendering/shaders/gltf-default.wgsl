struct VertexInput {
  @location(0) position: vec3<f32>
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) world_position: vec3<f32>
}

struct ViewParameters {
  view_projection: mat4x4<f32>
}

struct NodeParameters {
  transform: mat4x4<f32>
}

@group(0) @binding(0)
var<uniform> view_parameters: ViewParameters;

@group(1) @binding(0)
var<uniform> node_parameters: NodeParameters;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
  var out: VertexOutput;

  out.position =
      view_parameters.view_projection *
      node_parameters.transform *
      vec4<f32>(vert.position, 1.0);
  out.world_position = vert.position.xyz;

  return out;
}

struct FragmentOutput {
  @location(0) color: vec4<f32>
}

@fragment
fn fragment_main(in: VertexOutput) -> FragmentOutput {
  var out: FragmentOutput;

  let dx = dpdx(in.world_position);
  let dy = dpdy(in.world_position);
  let normalisedNormal = normalize(cross(dx, dy));
  let colorRepresentationOfNormal = vec4<f32>((normalisedNormal + 1.0) * 0.5, 1.0);

  out.color = colorRepresentationOfNormal;
  return out;
}
