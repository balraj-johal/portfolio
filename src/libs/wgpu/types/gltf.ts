/* eslint-disable @typescript-eslint/no-explicit-any */
/** Simple skeleton type that describes which properties can be expected
 *  on a gltf header. */
export interface GltfJsonHeader {
  accessors?: Record<string, any>[];
  asset?: any;
  bufferViews?: Record<string, any>[];
  buffers?: Record<string, any>[];
  cameras?: Record<string, any>[];
  materials?: Record<string, any>[];
  meshes?: Record<string, any>[];
  nodes?: Record<string, any>[];
  /** Default scene */
  scene?: number;
  scenes?: Record<string, any>[];
}
