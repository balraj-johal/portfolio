import { log } from "@/utils/logger";
import type { PositionInput, KeysInput } from "@/libs/wgpu/types/input";

enum InputMethod {
  MOUSE = "mouse",
  TOUCH = "touch",
  KEYBOARD = "keyboard",
}

function getEventPosition(event: MouseEvent | Event): PositionInput {
  if (event instanceof PointerEvent || event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY };
  }

  return null;
}

function getInputMethodOnLoad() {
  if (window.matchMedia("(pointer: fine)").matches) return InputMethod.MOUSE;
  return InputMethod.TOUCH;
}

class InputController {
  private eventController = new AbortController();
  private readonly eventOptions: AddEventListenerOptions = {
    signal: this.eventController.signal,
    passive: true,
  };

  private _position: PositionInput = null;
  private _clickedPosition: PositionInput = null;
  private _pressedKeys: KeysInput = [];

  private _lastInputMethod = getInputMethodOnLoad();

  readonly positionDelta = { x: 0, y: 0 };

  readonly onMove = new Map<string, (position: PositionInput) => void>();
  readonly onClick = new Map<string, (position: PositionInput) => void>();
  readonly onKey = new Map<string, (keys: KeysInput) => void>();
  readonly onLastMethodChange = new Map<
    string,
    (method: InputMethod) => void
  >();

  constructor() {
    this.setup();

    document.body.dataset.lastInputMethod = this._lastInputMethod;
  }

  get pressedKeys() {
    return this._pressedKeys;
  }

  set pressedKeys(value: KeysInput) {
    this._pressedKeys = value;
    this.executeOnKeyCallbacks();
  }

  get clickedPosition() {
    return this._clickedPosition;
  }

  set clickedPosition(value: PositionInput) {
    this._clickedPosition = value;
    this.executeOnClickCallbacks();
  }

  get position() {
    return this._position;
  }

  set position(newPosition: PositionInput) {
    this._position = newPosition;

    this.executeOnMoveCallbacks();
  }

  get lastInputMethod() {
    return this._lastInputMethod;
  }

  set lastInputMethod(value: InputMethod) {
    if (this._lastInputMethod === value) return;

    this._lastInputMethod = value;
    document.body.dataset.lastInputMethod = value;
  }

  private executeOnKeyCallbacks() {
    for (const [_, callback] of this.onKey) {
      callback(this._pressedKeys);
    }
  }

  private executeOnClickCallbacks() {
    for (const [_, callback] of this.onClick) {
      callback(this.clickedPosition);
    }
  }

  private executeOnMoveCallbacks() {
    for (const [_, callback] of this.onMove) {
      callback(this.position);
    }
  }

  private pressKey = ({ key, repeat }: KeyboardEvent) => {
    if (repeat) return;

    this.lastInputMethod = InputMethod.KEYBOARD;
    this.pressedKeys = [...this.pressedKeys, key.toUpperCase()];

    log(`[INPUT]: key ${key} pressed`);
  };

  private updateLastInputFromPointer(event: MouseEvent | PointerEvent | Event) {
    if (event instanceof PointerEvent) {
      const isMouse = event.pointerType === "mouse";
      this.lastInputMethod = isMouse ? InputMethod.MOUSE : InputMethod.TOUCH;
    }
  }

  private move = (event: MouseEvent) => {
    const position = getEventPosition(event);
    if (!position) return;

    this.updateLastInputFromPointer(event);

    this.position = position;
    this.positionDelta.x = event.movementX;
    this.positionDelta.y = event.movementY;
  };

  private click = (event: MouseEvent | PointerEvent | Event) => {
    const position = getEventPosition(event);
    if (!position) return;

    this.updateLastInputFromPointer(event);
    this.clickedPosition = position;

    log(`[INPUT]: pointer pressed at ${position.x}, ${position.y}`);
  };

  private removePosition = () => {
    this.clickedPosition = null;

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
    window.addEventListener("keydown", this.pressKey, this.eventOptions);
    window.addEventListener("keyup", this.releaseKey, this.eventOptions);
    window.addEventListener("pointerdown", this.click, this.eventOptions);
    window.addEventListener("mousemove", this.move, this.eventOptions);
    window.addEventListener("mouseup", this.removePosition, this.eventOptions);
    window.addEventListener("touchup", this.removePosition, this.eventOptions);
  }

  cleanup() {
    this.eventController.abort();
    this.eventController = new AbortController();
    this.eventOptions.signal = this.eventController.signal;
  }
}

const input = new InputController();

export default input;
