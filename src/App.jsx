import { useState, useRef, useCallback, useEffect } from 'react'
import { useGamepadInput } from './hooks/useGamepadInput'
import Header from './components/Header'
import SettingsModal from './components/SettingsModal'
import PressureBar from './components/PressureBar'
import InputTrace from './components/InputTrace'
import SteeringWheel from './components/SteeringWheel'
import PedalTelemetry from './components/PedalTelemetry'
import DrillMode from './components/DrillMode'
import SessionStats from './components/SessionStats'
import DebriefCard from './components/DebriefCard'
import GamepadDebug from './components/GamepadDebug'

function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('simbrake-settings');
    return saved ? JSON.parse(saved) : {
      gamepadIndex: null,
      axisMapping: { brake: 6, throttle: 7, steering: 0 },
      lockToLock: 900
    };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState({ brake: 0, throttle: 0, steering: 0 });
  const [practiceMode, setPracticeMode] = useState(false);

  // Auto-detect and select first gamepad if none selected
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id, 'at index', e.gamepad.index);
      
      // Auto-select first gamepad if none selected
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

  const handleDrillComplete = (drillResult, sessionData) => {
    console.log('Drill completed:', drillResult);
  };

  useGamepadInput(settings.gamepadIndex, settings.axisMapping, handleInput);

  const drillMode = practiceMode ? DrillMode({ 
    currentPressure: currentInput.brake,
    onDrillComplete: handleDrillComplete
  }) : { targetZone: null, holdProgress: 0, drillState: 'off', performanceProfile: { totalDrills: 0, totalSuccesses: 0, zones: {} }, sessionData: [], consistencyScore: 0 };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <Header
        onSettingsClick={() => setIsSettingsOpen(true)}
        onDebriefClick={() => setIsDebriefOpen(true)}
        debriefDisabled={drillMode.performanceProfile.totalDrills === 0}
        practiceMode={practiceMode}
        onPracticeModeToggle={() => setPracticeMode(!practiceMode)}
      />
      
      <div className="flex gap-8 justify-center items-start">
        <InputTrace
          currentPressure={currentInput.brake}
          currentThrottle={currentInput.throttle}
          targetZone={drillMode.targetZone}
        />
        
        <PressureBar
          currentPressure={currentInput.brake}
          targetZone={drillMode.targetZone}
          holdProgress={drillMode.holdProgress}
        />
        
        <div className="flex flex-col gap-6">
          {/* Big Throttle Bar - matching brake width */}
          <div className="relative bg-gray-800 border border-gray-700 rounded" style={{ width: '40px', height: '192px' }}>
            <div
              className="absolute bottom-0 w-full bg-throttle"
              style={{ height: `${currentInput.throttle}%` }}
            />
            <div
              className="absolute w-full h-0.5 bg-white"
              style={{ bottom: `${currentInput.throttle}%` }}
            />
            <div className="absolute -right-8 top-0 text-xs text-gray-500">100</div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-gray-500">50</div>
            <div className="absolute -right-8 bottom-0 text-xs text-gray-500">0</div>
          </div>

          {practiceMode && (
            <div className="text-sm bg-gray-800 p-3 rounded">
              <p className="monospace">Drills: {drillMode.performanceProfile.totalDrills}</p>
              <p className="monospace">Success: {drillMode.performanceProfile.totalSuccesses}</p>
              <p className="monospace">Consistency: {drillMode.consistencyScore}</p>
              <p className="text-xs text-gray-400 mt-1">{drillMode.drillState}</p>
            </div>
          )}
        </div>
      </div>

      {/* Steering Wheel - Below main UI */}
      <div className="flex justify-center mt-6">
        <SteeringWheel
          steeringValue={currentInput.steering}
          lockToLock={settings.lockToLock}
        />
      </div>

      {practiceMode && (
        <SessionStats
          performanceProfile={drillMode.performanceProfile}
          consistencyScore={drillMode.consistencyScore}
          sessionData={drillMode.sessionData}
        />
      )}

      <GamepadDebug gamepadIndex={settings.gamepadIndex} />

      {isDebriefOpen && (
        <DebriefCard
          sessionData={drillMode.sessionData}
          performanceProfile={drillMode.performanceProfile}
          consistencyScore={drillMode.consistencyScore}
          onClose={() => setIsDebriefOpen(false)}
        />
      )}

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
// built per: frontend.md, backend.md, techstack.md
