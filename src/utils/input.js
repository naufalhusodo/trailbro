// Input normalization and deadzone handling
export const applyDeadzone = (value, deadzone = 0.02) => {
  const abs = Math.abs(value);
  if (abs < deadzone) return 0;
  return value;
};

// Normalize button value (0 to 1) to percentage (0 to 100)
export const normalizeButton = (value, deadzone = 0.02) => {
  const cleaned = applyDeadzone(value, deadzone);
  return Math.max(0, Math.min(100, cleaned * 100));
};

// Smoothing state
const smoothingState = {
  brake: 0,
  throttle: 0
};

// Apply exponential moving average smoothing
const smoothInput = (current, previous, smoothingFactor = 0.6) => {
  return previous + (current - previous) * smoothingFactor;
};

// Normalize trigger axis: -1 (not pressed) to 1 (fully pressed) → 0 to 100
export const normalizeTrigger = (value, deadzone = 0.02) => {
  // Triggers report -1 when not pressed, 1 when fully pressed
  const cleaned = applyDeadzone(value, deadzone);
  return Math.max(0, Math.min(100, ((cleaned + 1) / 2) * 100));
};

// Normalize regular axis value from -1..1 to 0..100
export const normalizeAxis = (value, deadzone = 0.02) => {
  const cleaned = applyDeadzone(value, deadzone);
  return Math.max(0, Math.min(100, ((cleaned + 1) / 2) * 100));
};

// Get current gamepad state
export const readGamepad = (gamepadIndex, axisMapping, inputMode = 'gamepad') => {
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

  // Apply smoothing
  smoothingState.brake = smoothInput(rawBrake, smoothingState.brake);
  smoothingState.throttle = smoothInput(rawThrottle, smoothingState.throttle);

  return {
    brake: smoothingState.brake,
    throttle: smoothingState.throttle,
    steering: gamepad.axes[axisMapping.steering] || 0,
  };
};

// Get list of connected gamepads
export const getConnectedGamepads = () => {
  const gamepads = navigator.getGamepads();
  return Array.from(gamepads)
    .filter(gp => gp !== null)
    .map((gp, index) => ({ index, id: gp.id }));
};
// built per: backend.md, techstack.md, requirements.md
// Default button mapping: brake=6 (left trigger/L2), throttle=7 (right trigger/R2), steering=axis 0 (left stick X)
