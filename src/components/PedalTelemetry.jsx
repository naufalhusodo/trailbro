import PropTypes from 'prop-types';

export default function PedalTelemetry({ brake, throttle }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-12 h-48 bg-gray-800 border border-gray-700 rounded">
          <div
            className="absolute bottom-0 w-full bg-brake"
            style={{ height: `${brake}%` }}
          />
        </div>
        <div className="text-xs text-gray-400">Brake</div>
        <div className="monospace text-sm">{brake.toFixed(0)}</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="relative w-12 h-48 bg-gray-800 border border-gray-700 rounded">
          <div
            className="absolute bottom-0 w-full bg-throttle"
            style={{ height: `${throttle}%` }}
          />
        </div>
        <div className="text-xs text-gray-400">Throttle</div>
        <div className="monospace text-sm">{throttle.toFixed(0)}</div>
      </div>
    </div>
  );
}

PedalTelemetry.propTypes = {
  brake: PropTypes.number.isRequired,
  throttle: PropTypes.number.isRequired,
};
