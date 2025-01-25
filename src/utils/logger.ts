/**
 * @file Exposes production safe logging functions.
 *
 * Uses a variable attached to the window object to determine whether to write logs,
 * allowing for runtime enabling/disabling.
 *
 * To enable, set window.debugMode to true in a running devTools console.
 *
 * A bookmarklet can be created using the following JS for ease of enabling:
 * ```javascript: (() => { sessionStorage.setItem("debugMode", "true"); })();```
 */

/**
 * @returns string - timestamp in form of [HH:MM:SS].
 */
function getTimestampString() {
  const now = new Date();

  const hoursString = String(now.getHours()).padStart(2, "0");
  const minsString = String(now.getMinutes()).padStart(2, "0");
  const secondsString = String(now.getSeconds()).padStart(2, "0");
  const millisecondsString = String(now.getMilliseconds()).padStart(2, "0");

  return `[${hoursString}:${minsString}:${secondsString}:${millisecondsString}]\n`;
}

/** Production safe console log, using console.debug for ease of filtering. */
export function log(message?: unknown, ...optionalParams: unknown[]) {
  if (sessionStorage.getItem("debugMode")) {
    console.debug(getTimestampString(), message, ...optionalParams);
  }
}

/** Production safe console warning. */
export function warn(message?: unknown, ...optionalParams: unknown[]) {
  if (sessionStorage.getItem("debugMode")) {
    console.warn(getTimestampString(), message, ...optionalParams);
  }
}

/** Production safe console error. */
export function exception(message?: unknown, ...optionalParams: unknown[]) {
  if (sessionStorage.getItem("debugMode")) {
    console.error(getTimestampString(), message, ...optionalParams);
  }
}
