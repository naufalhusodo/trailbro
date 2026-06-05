import { useEffect, useRef } from 'react';
import { readGamepad } from '../utils/input';

export const useGamepadInput = (gamepadIndex, axisMapping, onInput, inputMode = 'gamepad') => {
  const rafRef = useRef(null);
  const smoothingRef = useRef({ brake: 0, throttle: 0 });
  const rawDataRef = useRef(null);

  useEffect(() => {
    if (gamepadIndex === null || !axisMapping) return;

    const pollInput = () => {
      const input = readGamepad(gamepadIndex, axisMapping, inputMode, smoothingRef);
      if (input) {
        rawDataRef.current = input.raw;
        const { raw, ...normalized } = input;
        onInput(normalized);
      }
      rafRef.current = requestAnimationFrame(pollInput);
    };

    rafRef.current = requestAnimationFrame(pollInput);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gamepadIndex, axisMapping, onInput, inputMode]);

  return rawDataRef;
};
