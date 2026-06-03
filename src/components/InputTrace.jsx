import { useRef, useEffect } from 'react';

export default function InputTrace({ currentPressure, currentThrottle, targetZone }) {
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const width = canvas.width;
    const height = canvas.height;

    const draw = (timestamp) => {
      // Add current pressure and throttle to history (keep last ~600 frames = ~10 seconds at 60fps for slower scroll)
      historyRef.current.push({ brake: currentPressure, throttle: currentThrottle });
      if (historyRef.current.length > 600) {
        historyRef.current.shift();
      }

      // Clear canvas
      ctx.fillStyle = '#1f1f1f';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
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

      // Draw throttle history line (green, behind brake)
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

      // Draw brake pressure history line (on top) - always red
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
  }, [currentPressure, currentThrottle, targetZone]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={192}
      className="border border-gray-700 rounded"
    />
  );
}
// built per: frontend.md, requirements.md, techstack.md
