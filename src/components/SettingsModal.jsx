import { useState, useEffect } from 'react';
import { getConnectedGamepads } from '../utils/input';

const WHEEL_VARIANTS = [
  "Alpine A525 F1", "BMW M4 GT3", "Conspit GT", "Default", "ES Pro",
  "Fanatec F1", "Ferrari 296 GT3", "Ferrari 296 GT3 (HQ)", "Ferrari 296 GT3 (No Logo)",
  "Ferrari SF1000 F1", "FKA Formula Wheel", "Generic", "Huracan GT3",
  "Logitech G923", "Mclaren 720s GT3", "Mercedes AMG GT3", "Mercedes F1",
  "Moza R5", "Mustang GT3", "MX-5 Cup", "Nascar Fanatec", "Porsche 911 GT3",
  "Porsche 963 GTP", "PXN W-AS", "Red Bull F1", "Simagic GT"
];

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [gamepads, setGamepads] = useState([]);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      updateGamepadList();
    }
  }, [isOpen, settings]);

  useEffect(() => {
    // Listen for gamepad connection events
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      updateGamepadList();
    };

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      updateGamepadList();
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  const updateGamepadList = () => {
    setGamepads(getConnectedGamepads());
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        {/* Device Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Gamepad Device</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.gamepadIndex ?? ''}
            onChange={(e) => setLocalSettings({ ...localSettings, gamepadIndex: e.target.value === '' ? null : parseInt(e.target.value) })}
          >
            <option value="">None</option>
            {gamepads.map(gp => (
              <option key={gp.index} value={gp.index}>{gp.id}</option>
            ))}
          </select>
          <button
            onClick={updateGamepadList}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Refresh devices
          </button>
        </div>

        {/* Axis Assignments */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Brake Button (L2/LT)</label>
          <input
            type="number"
            min="0"
            max="20"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.axisMapping.brake}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              axisMapping: { ...localSettings.axisMapping, brake: parseInt(e.target.value) }
            })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Throttle Button (R2/RT)</label>
          <input
            type="number"
            min="0"
            max="20"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.axisMapping.throttle}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              axisMapping: { ...localSettings.axisMapping, throttle: parseInt(e.target.value) }
            })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Steering Axis</label>
          <input
            type="number"
            min="0"
            max="10"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.axisMapping.steering}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              axisMapping: { ...localSettings.axisMapping, steering: parseInt(e.target.value) }
            })}
          />
        </div>

        {/* Lock-to-Lock Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Lock-to-Lock Range (degrees)</label>
          <input
            type="number"
            min="180"
            max="1080"
            step="90"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.lockToLock}
            onChange={(e) => setLocalSettings({ ...localSettings, lockToLock: parseInt(e.target.value) })}
          />
        </div>

        {/* Steering Wheel Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Steering Wheel</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={localSettings.wheelVariant}
            onChange={(e) => setLocalSettings({ ...localSettings, wheelVariant: e.target.value })}
          >
            {WHEEL_VARIANTS.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div className="mt-2 flex justify-center">
            <img
              src={`/icons/${encodeURIComponent(localSettings.wheelVariant)}/Wheel.png`}
              alt="Preview"
              className="w-24 h-24 object-contain opacity-70"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
// built per: frontend.md, requirements.md, backend.md
