import { useState, useCallback, useEffect } from 'react'
import { useGamepadInput } from './hooks/useGamepadInput'
import Header from './components/Header'
import SettingsModal from './components/SettingsModal'
import InputTrace from './components/InputTrace'
import SteeringWheel from './components/SteeringWheel'
import PedalTelemetry from './components/PedalTelemetry'
import GamepadDebug from './components/GamepadDebug'

function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('simbrake-settings');
      return saved ? JSON.parse(saved) : {
        gamepadIndex: null,
        axisMapping: { brake: 6, throttle: 7, steering: 0 },
        lockToLock: 420,
        wheelVariant: 'Generic',
        inputMode: 'gamepad'
      };
    } catch {
      return {
        gamepadIndex: null,
        axisMapping: { brake: 6, throttle: 7, steering: 0 },
        lockToLock: 420,
        wheelVariant: 'Generic',
        inputMode: 'gamepad'
      };
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState({ brake: 0, throttle: 0, steering: 0 });
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [gamepadSupported, setGamepadSupported] = useState(true);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!navigator.getGamepads) {
      setGamepadSupported(false);
    }
  }, []);

  useEffect(() => {
    const handleGamepadConnected = (e) => {
      if (settings.gamepadIndex === null) {
        const newSettings = { ...settings, gamepadIndex: e.gamepad.index };
        setSettings(newSettings);
        localStorage.setItem('simbrake-settings', JSON.stringify(newSettings));
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, [settings]);

  const handleInput = useCallback((input) => {
    setCurrentInput(input);
  }, []);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('simbrake-settings', JSON.stringify(newSettings));
  };

  const rawDataRef = useGamepadInput(settings.gamepadIndex, settings.axisMapping, handleInput, settings.inputMode);

  if (!gamepadSupported) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold monospace mb-4">TrailBro</h1>
          <p className="text-gray-400">Web Gamepad API is not supported in this browser.</p>
          <p className="text-gray-500 text-sm mt-2">Try using a Chromium-based browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 flex flex-col">
      <Header
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: viewportHeight / 8 }}>
        <div className="flex gap-8 justify-center items-start">
          <InputTrace
            currentPressure={currentInput.brake}
            currentThrottle={currentInput.throttle}
          />

          <PedalTelemetry
            brake={currentInput.brake}
            throttle={currentInput.throttle}
          />
        </div>

        <div className="flex justify-center mt-6">
          <SteeringWheel
            steeringValue={currentInput.steering}
            lockToLock={settings.lockToLock}
            wheelVariant={settings.wheelVariant}
          />
        </div>
      </div>

      <GamepadDebug rawDataRef={rawDataRef} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  )
}

export default App
