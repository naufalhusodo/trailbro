export default function PressureBar({ currentPressure, targetZone, holdProgress }) {
  const isInZone = targetZone && currentPressure >= targetZone.min && currentPressure <= targetZone.max;

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded" style={{ width: '40px', height: '192px' }}>
      {/* Current Pressure Fill */}
      <div
        className={`absolute bottom-0 w-full ${
          isInZone ? 'bg-green-500' : 'bg-brake'
        }`}
        style={{ height: `${currentPressure}%`, zIndex: 1 }}
      />

      {/* Hold Timer Progress */}
      {holdProgress > 0 && (
        <div
          className="absolute bottom-0 w-full bg-green-400 opacity-60"
          style={{ height: `${holdProgress * 100}%`, zIndex: 2 }}
        />
      )}

      {/* Target Zone */}
      {targetZone && (
        <div
          className="absolute w-full bg-yellow-600 bg-opacity-40 border-y border-yellow-500"
          style={{
            bottom: `${targetZone.min}%`,
            height: `${targetZone.max - targetZone.min}%`,
            zIndex: 3
          }}
        />
      )}

      {/* Current Pressure Indicator Line */}
      <div
        className="absolute w-full h-0.5 bg-white"
        style={{ bottom: `${currentPressure}%`, zIndex: 4 }}
      />

      {/* Percentage Labels */}
      <div className="absolute -right-8 top-0 text-xs text-gray-500">100</div>
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-gray-500">50</div>
      <div className="absolute -right-8 bottom-0 text-xs text-gray-500">0</div>
    </div>
  );
}
// built per: frontend.md, requirements.md, backend.md
