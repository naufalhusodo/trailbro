export const applyDeadzone = (value, deadzone = 0.02) => {
  const abs = Math.abs(value);
  if (abs < deadzone) return 0;
  return value;
};

export const normalizeButton = (value, deadzone = 0.02) => {
  const cleaned = applyDeadzone(value, deadzone);
  return Math.max(0, Math.min(100, cleaned * 100));
};

export const smoothInput = (current, previous, smoothingFactor = 0.6) => {
  return previous + (current - previous) * smoothingFactor;
};

export const normalizeTrigger = (value, deadzone = 0.02) => {
  const cleaned = applyDeadzone(value, deadzone);
  return Math.max(0, Math.min(100, ((cleaned + 1) / 2) * 100));
};

export const readGamepad = (gamepadIndex, axisMapping, inputMode = 'gamepad', smoothingRef) => {
  const gamepads = navigator.getGamepads();
  const gamepad = gamepads[gamepadIndex];

  if (!gamepad) return null;

  let rawBrake, rawThrottle;

  if (inputMode === 'wheel') {
    rawBrake = normalizeTrigger(gamepad.axes[axisMapping.brake] || 0);
    rawThrottle = normalizeTrigger(gamepad.axes[axisMapping.throttle] || 0);
  } else {
    rawBrake = normalizeButton(gamepad.buttons[axisMapping.brake]?.value || 0);
    rawThrottle = normalizeButton(gamepad.buttons[axisMapping.throttle]?.value || 0);
  }

  const smoothed = {
    brake: smoothInput(rawBrake, smoothingRef.current.brake),
    throttle: smoothInput(rawThrottle, smoothingRef.current.throttle),
  };
  smoothingRef.current = smoothed;

  return {
    ...smoothed,
    steering: gamepad.axes[axisMapping.steering] || 0,
    raw: {
      id: gamepad.id,
      axes: Array.from(gamepad.axes),
      buttons: Array.from(gamepad.buttons).map(b => ({
        pressed: b.pressed,
        value: b.value
      }))
    }
  };
};

export const getConnectedGamepads = () => {
  const gamepads = navigator.getGamepads();
  return Array.from(gamepads)
    .filter(gp => gp !== null)
    .map((gp, index) => ({ index, id: gp.id }));
};
