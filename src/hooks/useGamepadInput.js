import { useEffect, useRef } from 'react';
import { readGamepad } from '../utils/input';

// Custom hook for gamepad input polling at 60fps
export const useGamepadInput = (gamepadIndex, axisMapping, onInput) => {
  const rafRef = useRef(null);

  useEffect(() => {
    if (gamepadIndex === null || !axisMapping) return;

    const pollInput = () => {
      const input = readGamepad(gamepadIndex, axisMapping);
      if (input) {
        onInput(input);
      }
      rafRef.current = requestAnimationFrame(pollInput);
    };

    rafRef.current = requestAnimationFrame(pollInput);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gamepadIndex, axisMapping, onInput]);
};
// built per: backend.md, techstack.md, requirements.md
