import input, { PositionInput } from "@/libs/controllers/input";
import { Camera, CameraProperties } from "@/libs/wgpu/classes/camera";
import { getKeyboardActions } from "@/utils/actions";

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

const SPEED_SCALAR = 0.001;

export class FpsCamera extends Camera {
  private sprintScalar = 3;
  private speed = 1;

  constructor(properties: CameraProperties) {
    super(properties);

    this.setup();
  }

  private handleLookMove() {
    console.log("erer", input.positionDelta);
  }

  private getFinalSpeed(actions: Action[]) {
    const sprintSpeedInfluence = actions.includes(Action.SPRINT)
      ? this.sprintScalar
      : 1;
    return sprintSpeedInfluence * SPEED_SCALAR * this.speed;
  }

  private getVelocity(actions: Action[]) {
    const velocity = [0, 0, 0];

    // x
    velocity[0] =
      (actions.includes(Action.STRAFE_LEFT) ? -1 : 0) +
      (actions.includes(Action.STRAFE_RIGHT) ? 1 : 0);
    // y
    velocity[1] =
      (actions.includes(Action.FLOAT_UP) ? 1 : 0) +
      (actions.includes(Action.SINK) ? -1 : 0);
    // z
    velocity[2] =
      (actions.includes(Action.FORWARD) ? -1 : 0) +
      (actions.includes(Action.BACKWARD) ? 1 : 0);

    return velocity;
  }

  update(delta: number) {
    const actions = getKeyboardActions(KEY_ACTION_MAPS);

    const finalSpeed = this.getFinalSpeed(actions);
    const velocity = this.getVelocity(actions);

    for (let i = 0; i < 3; i++) {
      this.position[i] += velocity[i] * finalSpeed * delta;
    }
  }

  setup() {
    input.onMove.set("fps-camera", this.handleLookMove);
  }

  teardown() {
    input.onMove.delete("fps-camera");
  }
}
