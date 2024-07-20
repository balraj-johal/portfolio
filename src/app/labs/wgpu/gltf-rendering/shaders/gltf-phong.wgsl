struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) tex_coord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
};

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) world_position: vec3<f32>,
  @location(1) tex_coord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
};

struct MaterialParameters {
    base_color_factor: vec4<f32>,
    metallic_factor: f32,
    roughness_factor: f32,
    emissive_factor: vec3<f32>,
    occlusion_strength: f32,
    normal_scale: f32,
};

struct ViewParameters {
  view_projection: mat4x4<f32>,
  camera_position: vec3<f32>,
};

struct NodeParameters {
  transform: mat4x4<f32>,
};

struct LightingParameters {
  light_position: vec3<f32>,
};

@group(0) @binding(0)
var<uniform> view_parameters: ViewParameters;

@group(1) @binding(0)
var<uniform> node_parameters: NodeParameters;

@group(2) @binding(0)
var<uniform> material_parameters: MaterialParameters;
@group(2) @binding(1)
var base_color_texture: texture_2d<f32>;
@group(2) @binding(2)
var base_color_sampler: sampler;

@group(3) @binding(0)
var<uniform> lighting_parameters: LightingParameters;

// see: https://github.com/Twinklebear/webgpu-0-to-gltf/blob/main/5-textures-ts/src/gltf_prim.wgsl#L45-L50
fn linear_to_srgb(x: f32) -> f32 {
    if (x <= 0.0031308) {
        return 12.92 * x;
    }
    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
};

fn vec3_linear_to_srgb(linear: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(linear_to_srgb(linear.x), linear_to_srgb(linear.y), linear_to_srgb(linear.z));
};

fn get_debug_color(input: vec3<f32>) -> vec4<f32> {
  return vec4<f32>(input, 1.0);
};

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
  var out: VertexOutput;

  let model_vertex_position = vec4<f32>(vert.position, 1.0);
  let world_position = node_parameters.transform * model_vertex_position;
  let final_position = view_parameters.view_projection * world_position;

  out.position = final_position;
  out.world_position = world_position.xyz;
  out.tex_coord_0 = vert.tex_coord_0;
  out.normal = vert.normal;

  return out;
}

struct FragmentOutput {
  @location(0) color: vec4<f32>,
}

@fragment
fn fragment_main(in: VertexOutput) -> FragmentOutput {
  var out: FragmentOutput;

  let ambient_strength = 0.4;
  let diffuse_strength = 0.6;
  let specular_strength = 0.5;

  let light_color = vec3<f32>(1.0, 1.0, 1.0);
  let light_position = lighting_parameters.light_position;

  // calculated mesh normal from world position
  // let dx = dpdx(in.world_position);
  // let dy = dpdy(in.world_position);
  // let normalisedNormal = normalize(cross(dx, dy));
  // let colorRepresentationOfNormal = vec4<f32>((normalisedNormal + 1.0) * 0.5, 1.0);
  // out.color = colorRepresentationOfNormal;

  // get texture color in srgb space
  // TODO: confirm I need to perform the linear to srgb conversion, as
  //       isn't the format of the texture set in GLTFTexture?
  let base_color: vec4<f32> = textureSample(base_color_texture, base_color_sampler, in.tex_coord_0);
  let adjusted_color = base_color * material_parameters.base_color_factor;
  let model_color = vec4<f32>(vec3_linear_to_srgb(adjusted_color.xyz), adjusted_color.w);

  // calculate diffuse
  let normalized_normal = normalize(in.normal);
  let light_direction = normalize(light_position - in.world_position);
  let diffuse = max(dot(normalized_normal, light_direction), 0.0);

  // calculate specular
  let view_direction = normalize(view_parameters.camera_position - in.world_position);
  let reflection_direction = normalize(reflect(-light_direction, normalized_normal));
  let specular = pow(max(dot(view_direction, reflection_direction), 0.0), 32);

  let ambient_color = ambient_strength * light_color;
  let diffuse_color = diffuse_strength * diffuse * light_color;
  let specular_color = specular_strength * specular * light_color;
  let final_lighting_color = ambient_color + diffuse_color + specular_color;

  let result = vec4<f32>(final_lighting_color * model_color.xyz, model_color.w);

  out.color = result;
  return out;
}
