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
};

struct NodeParameters {
  transform: mat4x4<f32>,
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

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
  var out: VertexOutput;

  out.position =
      view_parameters.view_projection *
      node_parameters.transform *
      vec4<f32>(vert.position, 1.0);
  out.world_position = vert.position.xyz;
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

  let ambient_contribution = 0.1;
  let diffuse_contribution = 1.0;

  let light_color = vec3<f32>(1.0, 1.0, 1.0);
  let light_position = vec3<f32>(10.0, 20.0, 20.0);

  // calculated mesh normal from world position
  // let dx = dpdx(in.world_position);
  // let dy = dpdy(in.world_position);
  // let normalisedNormal = normalize(cross(dx, dy));
  // let colorRepresentationOfNormal = vec4<f32>((normalisedNormal + 1.0) * 0.5, 1.0);
  // out.color = colorRepresentationOfNormal;

  // get texture color in srgb space
  // TODO: confirm I need to perform the linear to srgb conversion
  //       isn't the format of the texture set in GLTFTexture?
  let base_color: vec4<f32> = textureSample(base_color_texture, base_color_sampler, in.tex_coord_0);
  let adjusted_color = base_color * material_parameters.base_color_factor;
  let srgb_color = vec4<f32>(vec3_linear_to_srgb(adjusted_color.xyz), adjusted_color.w);

  // calculate dot product of light to normal
  let normalisedNormal = normalize(in.normal);
  let lightDirection = light_position - in.world_position;
  let diffuse = max(dot(normalisedNormal, lightDirection), 0.0);

  let ambient_color = ambient_contribution * light_color;
  let diffuse_color = diffuse_contribution * diffuse * light_color;

  let final_lighting_color = ambient_color + diffuse_color;

  let result = vec4<f32>(final_lighting_color * srgb_color.xyz, srgb_color.w);

  out.color = result;
  return out;
}
