import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getConnectedGamepads } from '../utils/input';

const WHEEL_VARIANTS = [
  "Alpine A525 F1", "BMW M4 GT3", "Conspit GT", "Default", "ES Pro",
  "Fanatec F1", "Ferrari 296 GT3", "Ferrari 296 GT3 (HQ)", "Ferrari 296 GT3 (No Logo)",
  "Ferrari SF1000 F1", "FKA Formula Wheel", "Generic", "Huracan GT3",
  "Logitech G923", "Mclaren 720s GT3", "Mercedes AMG GT3", "Mercedes F1",
  "Moza R5", "Mustang GT3", "MX-5 Cup", "Nascar Fanatec", "Porsche 911 GT3",
  "Porsche 963 GTP", "PXN W-AS", "Red Bull F1", "Simagic GT"
];

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [gamepads, setGamepads] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      updateGamepadList();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleGamepadConnected = () => updateGamepadList();
    const handleGamepadDisconnected = () => updateGamepadList();

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const prevFocus = document.activeElement;

    const focusable = modal.querySelectorAll(FOCUSABLE);
    if (focusable.length) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prevFocus && prevFocus.focus) {
        prevFocus.focus();
      }
    };
  }, [isOpen, onClose]);

  const updateGamepadList = () => {
    setGamepads(getConnectedGamepads());
  };

  const update = (patch) => {
    const next = { ...settings, ...patch };
    onSave(next);
  };

  if (!isOpen) return null;

  const axisMax = settings.inputMode === 'wheel' ? 6 : 20;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 overflow-y-auto">
      <div
        className="min-h-full flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div ref={modalRef} className="bg-gray-900 p-6 rounded-lg w-full max-w-md" role="dialog" aria-label="Settings">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>

          {/* Device Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="gamepad-device">Gamepad Device</label>
            <select
              id="gamepad-device"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.gamepadIndex ?? ''}
              onChange={(e) => update({ gamepadIndex: e.target.value === '' ? null : parseInt(e.target.value) })}
            >
              <option value="">None</option>
              {gamepads.map(gp => (
                <option key={gp.index} value={gp.index}>{gp.id}</option>
              ))}
            </select>
            <button
              onClick={updateGamepadList}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              aria-label="Refresh gamepad devices"
            >
              Refresh devices
            </button>
          </div>

          {/* Input Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Input Mode</label>
            <div className="flex gap-2" role="radiogroup" aria-label="Input mode">
              <button
                onClick={() => update({
                  inputMode: 'gamepad',
                  axisMapping: settings.inputMode !== 'gamepad' ? { brake: 6, throttle: 7, steering: 0 } : settings.axisMapping,
                  lockToLock: settings.inputMode !== 'gamepad' ? 420 : settings.lockToLock
                })}
                className={`flex-1 px-3 py-2 rounded font-medium text-sm ${
                  settings.inputMode === 'gamepad'
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                role="radio"
                aria-checked={settings.inputMode === 'gamepad'}
              >
                Gamepad
              </button>
              <button
                onClick={() => update({
                  inputMode: 'wheel',
                  axisMapping: settings.inputMode !== 'wheel' ? { brake: 2, throttle: 1, steering: 0 } : settings.axisMapping,
                  lockToLock: settings.inputMode !== 'wheel' ? 900 : settings.lockToLock
                })}
                className={`flex-1 px-3 py-2 rounded font-medium text-sm ${
                  settings.inputMode === 'wheel'
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                role="radio"
                aria-checked={settings.inputMode === 'wheel'}
              >
                Steering Wheel
              </button>
            </div>
          </div>

          {/* Axis Assignments */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="brake-axis">
              {settings.inputMode === 'wheel' ? 'Brake Axis' : 'Brake Button (L2/LT)'}
            </label>
            <input
              id="brake-axis"
              type="number"
              min="0"
              max={axisMax}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.axisMapping.brake}
              onChange={(e) => update({
                axisMapping: { ...settings.axisMapping, brake: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="throttle-axis">
              {settings.inputMode === 'wheel' ? 'Throttle Axis' : 'Throttle Button (R2/RT)'}
            </label>
            <input
              id="throttle-axis"
              type="number"
              min="0"
              max={axisMax}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.axisMapping.throttle}
              onChange={(e) => update({
                axisMapping: { ...settings.axisMapping, throttle: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="steering-axis">Steering Axis</label>
            <input
              id="steering-axis"
              type="number"
              min="0"
              max="6"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.axisMapping.steering}
              onChange={(e) => update({
                axisMapping: { ...settings.axisMapping, steering: parseInt(e.target.value) }
              })}
            />
          </div>

          {/* Lock-to-Lock Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="lock-range">Lock-to-Lock Range (degrees)</label>
            <input
              id="lock-range"
              type="number"
              min="180"
              max="1080"
              step="90"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.lockToLock}
              onChange={(e) => update({ lockToLock: parseInt(e.target.value) })}
            />
          </div>

          {/* Steering Wheel Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="wheel-variant">Steering Wheel</label>
            <select
              id="wheel-variant"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={settings.wheelVariant}
              onChange={(e) => update({ wheelVariant: e.target.value })}
            >
              {WHEEL_VARIANTS.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="mt-2 flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}icons/${encodeURIComponent(settings.wheelVariant)}/Wheel.png`}
                alt="Preview"
                className="w-24 h-24 object-contain opacity-70"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    gamepadIndex: PropTypes.number,
    axisMapping: PropTypes.shape({
      brake: PropTypes.number.isRequired,
      throttle: PropTypes.number.isRequired,
      steering: PropTypes.number.isRequired,
    }).isRequired,
    lockToLock: PropTypes.number.isRequired,
    wheelVariant: PropTypes.string.isRequired,
    inputMode: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};
