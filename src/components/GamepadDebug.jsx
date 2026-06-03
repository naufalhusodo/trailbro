import { useState, useEffect } from 'react';

export default function GamepadDebug({ gamepadIndex }) {
  const [gamepadState, setGamepadState] = useState(null);

  useEffect(() => {
    if (gamepadIndex === null) return;

    const updateGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[gamepadIndex];
      
      if (gamepad) {
        setGamepadState({
          id: gamepad.id,
          axes: Array.from(gamepad.axes),
          buttons: Array.from(gamepad.buttons).map(b => ({
            pressed: b.pressed,
            value: b.value
          }))
        });
      }
      
      requestAnimationFrame(updateGamepad);
    };

    const rafId = requestAnimationFrame(updateGamepad);
    return () => cancelAnimationFrame(rafId);
  }, [gamepadIndex]);

  if (!gamepadState) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded p-4 mt-4">
        <h3 className="font-bold mb-2">Gamepad Debug</h3>
        <p className="text-gray-400 text-sm">No gamepad selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4 mt-4">
      <h3 className="font-bold mb-2">Gamepad Debug</h3>
      <p className="text-xs text-gray-400 mb-3">{gamepadState.id}</p>
      
      {/* Button 6 and 7 horizontal bars */}
      <div className="mb-4 space-y-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-brake w-24">Button 6 (L2):</span>
            <span className="monospace text-xs">{gamepadState.buttons[6]?.value.toFixed(3) || '0.000'}</span>
          </div>
          <div className="w-full bg-gray-800 h-6 rounded overflow-hidden">
            <div 
              className="h-full bg-brake"
              style={{ width: `${(gamepadState.buttons[6]?.value || 0) * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-throttle w-24">Button 7 (R2):</span>
            <span className="monospace text-xs">{gamepadState.buttons[7]?.value.toFixed(3) || '0.000'}</span>
          </div>
          <div className="w-full bg-gray-800 h-6 rounded overflow-hidden">
            <div 
              className="h-full bg-throttle"
              style={{ width: `${(gamepadState.buttons[7]?.value || 0) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Axes */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-blue-400">Axes</h4>
          <div className="space-y-1">
            {gamepadState.axes.map((value, index) => (
              <div key={index} className="flex items-center gap-2 text-xs monospace">
                <span className="text-gray-400 w-12">Axis {index}:</span>
                <div className="flex-1 bg-gray-800 h-4 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-blue-500 transition-all duration-75"
                    style={{ 
                      width: `${Math.abs(value) * 50}%`,
                      left: value < 0 ? `${50 + value * 50}%` : '50%'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[10px]">{value.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-400">Buttons</h4>
          <div className="grid grid-cols-4 gap-1">
            {gamepadState.buttons.map((button, index) => (
              <div 
                key={index} 
                className={`text-xs monospace p-2 rounded text-center ${
                  button.pressed ? 'bg-green-600' : 'bg-gray-800'
                }`}
              >
                <div className="font-bold">{index}</div>
                <div className="text-[10px]">{button.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// built per: requirements.md (debug component for gamepad testing)
