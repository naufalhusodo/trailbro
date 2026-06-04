export default function PressureBar({ currentPressure }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative bg-gray-800 border border-gray-700 rounded" style={{ width: '40px', height: '192px' }}>
        <div
          className="absolute bottom-0 w-full bg-brake"
          style={{ height: `${currentPressure}%`, zIndex: 1 }}
        />

        <div
          className="absolute w-full h-0.5 bg-white"
          style={{ bottom: `${currentPressure}%`, zIndex: 4 }}
        />
      </div>
      <div className="monospace text-sm text-gray-400">{currentPressure.toFixed(0)}</div>
    </div>
  );
}