export const getComputeShader = (
  workgroupSize: [number, number, number],
) => /* wgsl */ `
@group(0) @binding(0) var<storage, read> input_data: array<f32>;
@group(0) @binding(1) var<storage, read_write> output_data: array<f32>;

const offsets = array<f32, 4 * 2>(-1, 1, 1, 1, 1, -1, -1, -1);
const quad_vertices_length = 4 * 3;

fn generateQuad(
  origin: vec3<f32>,
  size: vec2<f32>,
) -> array<f32, 12> {
  let half_size = vec2<f32>(size.x / 2.0, size.y / 2.0);

  var vertices = array<f32, quad_vertices_length>();

  for (var offset_index = 0; offset_index < quad_vertices_length / 2; offset_index++) {
    let vertex_stride = offset_index * 3;
    let offset_stride = offset_index * 2;

    // x coord
    vertices[vertex_stride] = origin.x + half_size.x * offsets[offset_stride];
    // y coord
    vertices[vertex_stride + 1] = origin.y + half_size.y * offsets[offset_stride + 1];
    // z coord
    vertices[vertex_stride + 2] = 0.0;
  }

  return vertices;
}

@compute @workgroup_size(${workgroupSize[0]}, ${workgroupSize[1]}, ${workgroupSize[2]})
fn processInputData(
  @builtin(global_invocation_id) g_id: vec3<u32>
) {
  if (g_id.x < arrayLength(&input_data)) {
    let index = g_id.x;

    let origin = vec3<f32>(0.0, 0.0, 0.0);
    let quad_size = vec2<f32>(1.0, 1.0);

    let generated_quad = generateQuad(origin, quad_size);

    for (var output_offset: u32 = 0; output_offset < quad_vertices_length; output_offset++) {
      output_data[index + output_offset] = generated_quad[output_offset];
    }
  }
}
`;

export const getRenderShader = () => /* wgsl */ `
struct VertexInput {
  @location(0) position: vec4<f32>
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>
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

  return out;
}

struct FragmentOutput {
  @location(0) color: vec4<f32>
}

@fragment
fn fragment_main(in: VertexOutput) -> FragmentOutput {
  var out: FragmentOutput;
  out.color = vec4(1.0, 1.0, 1.0, 1.0);

  return out;
}
`;
