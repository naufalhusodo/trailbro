import { useState, useRef, useCallback, useEffect } from 'react'
import { useGamepadInput } from './hooks/useGamepadInput'
import Header from './components/Header'
import SettingsModal from './components/SettingsModal'
import PressureBar from './components/PressureBar'
import InputTrace from './components/InputTrace'
import SteeringWheel from './components/SteeringWheel'
import PedalTelemetry from './components/PedalTelemetry'
import GamepadDebug from './components/GamepadDebug'

function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('simbrake-settings');
    return saved ? JSON.parse(saved) : {
      gamepadIndex: null,
      axisMapping: { brake: 6, throttle: 7, steering: 0 },
      lockToLock: 900,
      wheelVariant: 'Generic'
    };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState({ brake: 0, throttle: 0, steering: 0 });
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

  useGamepadInput(settings.gamepadIndex, settings.axisMapping, handleInput);

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

        <PressureBar
          currentPressure={currentInput.brake}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="relative bg-gray-800 border border-gray-700 rounded" style={{ width: '40px', height: '192px' }}>
              <div
                className="absolute bottom-0 w-full bg-throttle"
                style={{ height: `${currentInput.throttle}%` }}
              />
              <div
                className="absolute w-full h-0.5 bg-white"
                style={{ bottom: `${currentInput.throttle}%` }}
              />
            </div>
            <div className="monospace text-sm text-gray-400">{currentInput.throttle.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <SteeringWheel
          steeringValue={currentInput.steering}
          lockToLock={settings.lockToLock}
          wheelVariant={settings.wheelVariant}
        />
      </div>

      </div>

      <GamepadDebug gamepadIndex={settings.gamepadIndex} />

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