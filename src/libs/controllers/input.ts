import { log } from "@/utils/logger";

type PositionInput = { x: number; y: number } | null;
type KeysInput = string[];

enum InputMethod {
  MOUSE = "mouse",
  TOUCH = "touch",
  KEYBOARD = "keyboard",
}

function getEventPosition(event: MouseEvent | Event): PositionInput {
  if (event instanceof PointerEvent || event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY };
  }

  if (event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY };
  }

  return null;
}

function getInputMethodOnLoad() {
  if (window.matchMedia("(pointer: fine)").matches) return InputMethod.MOUSE;
  return InputMethod.TOUCH;
}

class InputController {
  private _pressedKeys: KeysInput = [];
  private _pointerPosition: PositionInput = null;
  private _lastInputMethod = getInputMethodOnLoad();

  onKeyChange = new Map<string, (keys: KeysInput) => void>();
  onPositionChange = new Map<string, (position: PositionInput) => void>();
  onLastMethodChange = new Map<string, (method: InputMethod) => void>();

  constructor() {
    this.setup();

    document.body.dataset.lastInputMethod = this._lastInputMethod;
  }

  get pressedKeys() {
    return this._pressedKeys;
  }

  set pressedKeys(value: KeysInput) {
    this._pressedKeys = value;
    this.executeOnKeyChangeCallbacks();
  }

  get pointerPosition() {
    return this._pointerPosition;
  }

  set pointerPosition(value: PositionInput) {
    this._pointerPosition = value;
    this.executeOnPositionChangeCallbacks();
  }

  get lastInputMethod() {
    return this._lastInputMethod;
  }

  set lastInputMethod(value: InputMethod) {
    if (this._lastInputMethod === value) return;

    this._lastInputMethod = value;
    document.body.dataset.lastInputMethod = value;
  }

  private executeOnKeyChangeCallbacks() {
    for (const [_, callback] of this.onKeyChange) {
      callback(this._pressedKeys);
    }
  }

  private executeOnPositionChangeCallbacks() {
    for (const [_, callback] of this.onPositionChange) {
      callback(this.pointerPosition);
    }
  }

  private pressKey = ({ key, repeat }: KeyboardEvent) => {
    if (repeat) return;

    this.lastInputMethod = InputMethod.KEYBOARD;
    this.pressedKeys = [...this.pressedKeys, key.toUpperCase()];

    log(`[INPUT]: key ${key} pressed`);
  };

  private updatePosition = (event: MouseEvent | PointerEvent | Event) => {
    const position = getEventPosition(event);
    if (!position) return;

    if (event instanceof PointerEvent) {
      this.lastInputMethod =
        event.pointerType === "mouse" ? InputMethod.MOUSE : InputMethod.TOUCH;
    }
    this.pointerPosition = position;

    log(`[INPUT]: pointer pressed at ${position.x}, ${position.y}`);
  };

  private removePosition = () => {
    this.pointerPosition = null;

    log("[INPUT]: pointer released");
  };

  private releaseKey = ({ key: released }: KeyboardEvent) => {
    this.lastInputMethod = InputMethod.KEYBOARD;
    this.pressedKeys = this.pressedKeys.filter(
      (key) => key !== released.toUpperCase(),
    );

    log(`[INPUT]: key ${released} released`);
  };

  private setup() {
    window.addEventListener("keydown", this.pressKey, { passive: true });
    window.addEventListener("keyup", this.releaseKey, { passive: true });
    window.addEventListener("pointerdown", this.updatePosition, {
      passive: true,
    });
    window.addEventListener("touchstart", this.updatePosition, {
      passive: true,
    });
    window.addEventListener("mouseup", this.removePosition, { passive: true });
    window.addEventListener("touchup", this.removePosition, { passive: true });
  }

  cleanup() {
    window.removeEventListener("keydown", this.pressKey);
    window.removeEventListener("keyup", this.releaseKey);
    window.removeEventListener("pointerdown", this.updatePosition);
    window.removeEventListener("touchstart", this.updatePosition);
    window.removeEventListener("mouseup", this.removePosition);
    window.removeEventListener("touchup", this.removePosition);
  }
}

const input = new InputController();

export default input;
