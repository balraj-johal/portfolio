import input from "@/libs/controllers/input";
import { Camera, CameraProperties } from "@/libs/wgpu/classes/camera";
import { getKeyboardActions } from "@/utils/actions";
import { vec3 } from "wgpu-matrix";

console.log("HERE");

enum Action {
  FORWARD = "forward",
  BACKWARD = "backward",
  STRAFE_LEFT = "strafe_left",
  STRAFE_RIGHT = "strafe_right",
  FLOAT_UP = "float_up",
  SINK = "sink",
  SPRINT = "sprint",
}

const KEY_ACTION_MAPS: Record<Action, string[]> = {
  [Action.FORWARD]: ["W", "ArrowUp"],
  [Action.BACKWARD]: ["S", "ArrowDown"],
  [Action.STRAFE_LEFT]: ["A", "ArrowLeft"],
  [Action.STRAFE_RIGHT]: ["D", "ArrowRight"],
  [Action.SPRINT]: ["Shift"],
  [Action.FLOAT_UP]: ["E"],
  [Action.SINK]: ["Q"],
};

const LOOK_SCALAR = 0.001;
const SPEED_SCALAR = 0.001;

export class FpsCamera extends Camera {
  private lookSpeed = 1;

  private sprintScalar = 3;
  private baseWalkSpeed = 1;

  constructor(properties: CameraProperties) {
    super(properties);

    this.setup();
    this.rotate(0, 0, 0);
  }

  private readonly handleLookMove = () => {
    const { x, y } = input.positionDelta;

    this.rotate(
      LOOK_SCALAR * this.lookSpeed * y,
      LOOK_SCALAR * this.lookSpeed * x,
      0,
    );
  };

  private scaledSpeed(actions: Action[], delta: number) {
    const sprintSpeedInfluence = actions.includes(Action.SPRINT)
      ? this.sprintScalar
      : 1;
    const totalScaledSpeed =
      sprintSpeedInfluence * SPEED_SCALAR * this.baseWalkSpeed;

    return totalScaledSpeed * delta;
  }

  private getDirection(actions: Action[]) {
    const direction = vec3.fromValues(0, 0, 0);
    let [x, y, z] = direction;

    x =
      (actions.includes(Action.STRAFE_LEFT) ? -1 : 0) +
      (actions.includes(Action.STRAFE_RIGHT) ? 1 : 0);
    y =
      (actions.includes(Action.FLOAT_UP) ? 1 : 0) +
      (actions.includes(Action.SINK) ? -1 : 0);
    z =
      (actions.includes(Action.FORWARD) ? 1 : 0) +
      (actions.includes(Action.BACKWARD) ? -1 : 0);

    return direction;
  }

  private getDisplacement(direction: Float32Array, speed: number) {
    const finalDisplacement: Float32Array = vec3.create(0, 0, 0);

    // build movement axis displacements
    const strafe = vec3.mulScalar(this.right, direction[0]);
    vec3.add(finalDisplacement, strafe, finalDisplacement);

    const vertical = vec3.fromValues(0, direction[1], 0);
    vec3.add(finalDisplacement, vertical, finalDisplacement);

    const forward = vec3.mulScalar(this.forward, direction[2]);
    vec3.add(finalDisplacement, forward, finalDisplacement);

    // scale displacement by speed
    vec3.mulScalar(finalDisplacement, speed, finalDisplacement);

    // invert z axis, z forward is negative in WebGPU
    finalDisplacement[2] *= -1;

    return finalDisplacement;
  }

  update(delta: number) {
    const actions = getKeyboardActions(KEY_ACTION_MAPS, input.pressedKeys);

    const speed = this.scaledSpeed(actions, delta);
    const direction = this.getDirection(actions);

    const displacement = this.getDisplacement(direction, speed);
    this.translate(displacement);
  }

  setup() {
    input.onMove.set("fps-camera", this.handleLookMove);
  }

  teardown() {
    input.onMove.delete("fps-camera");
  }
}
