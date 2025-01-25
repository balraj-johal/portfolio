import input from "@/libs/controllers/input";
import { Camera, CameraProperties } from "@/libs/wgpu/classes/camera";
import { doArraysOverlap } from "@/utils/array";

enum Action {
  FORWARD = "forward",
  BACKWARD = "backward",
  STRAFE_LEFT = "strafe_left",
  STRAFE_RIGHT = "strafe_right",
  FLOAT_UP = "float_up",
  SINK = "sink",
  SPRINT = "sprint",
}

const KEY_ACTION_MAP: Record<Action, string[]> = {
  [Action.FORWARD]: ["W", "w", "ArrowUp"],
  [Action.BACKWARD]: ["S", "s", "ArrowDown"],
  [Action.STRAFE_LEFT]: ["A", "a", "ArrowLeft"],
  [Action.STRAFE_RIGHT]: ["D", "d", "ArrowRight"],
  [Action.SPRINT]: ["Shift"],
  [Action.SINK]: ["Q", "q"],
  [Action.FLOAT_UP]: ["E", "e"],
};

function getKeyboardActions(): Action[] {
  const actions: Action[] = [];

  for (const [action, map] of Object.entries(KEY_ACTION_MAP)) {
    if (doArraysOverlap(map, input.pressedKeys)) {
      actions.push(action as Action);
    }
  }

  return actions;
}

export class FpsCamera extends Camera {
  private sprintScalar = 3;
  private speedScalar = 0.001;
  speed = 1;

  constructor(properties: CameraProperties) {
    super(properties);
  }

  private getFinalSpeed(actions: Action[]) {
    const sprintSpeedInfluence = actions.includes(Action.SPRINT)
      ? this.sprintScalar
      : 1;

    return sprintSpeedInfluence * this.speedScalar * this.speed;
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
    const actions = getKeyboardActions();

    const finalSpeed = this.getFinalSpeed(actions);
    const velocity = this.getVelocity(actions);

    for (let i = 0; i < 3; i++) {
      this.position[i] += velocity[i] * finalSpeed * delta;
    }
  }
}
