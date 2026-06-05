import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function InputTrace({ currentPressure, currentThrottle }) {
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const rafRef = useRef(null);
  const pressureRef = useRef(currentPressure);
  const throttleRef = useRef(currentThrottle);

  pressureRef.current = currentPressure;
  throttleRef.current = currentThrottle;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      historyRef.current.push({ brake: pressureRef.current, throttle: throttleRef.current });
      if (historyRef.current.length > 600) {
        historyRef.current.shift();
      }

      ctx.fillStyle = '#1f1f1f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const histLen = historyRef.current.length;

      if (histLen > 1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();

        for (let i = 0; i < histLen; i++) {
          const x = (i / 600) * width;
          const y = height - (historyRef.current[i].throttle / 100) * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (histLen > 1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();

        for (let i = 0; i < histLen; i++) {
          const x = (i / 600) * width;
          const y = height - (historyRef.current[i].brake / 100) * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={192}
      className="border border-gray-700 rounded"
    />
  );
}

InputTrace.propTypes = {
  currentPressure: PropTypes.number.isRequired,
  currentThrottle: PropTypes.number.isRequired,
};
