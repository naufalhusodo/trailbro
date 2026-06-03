export default function SteeringWheel({ steeringValue, lockToLock }) {
  // Map steering axis (-1 to 1) to rotation degrees based on lock-to-lock range
  const rotation = steeringValue * (lockToLock / 2);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <div
          className="absolute inset-0 border-4 border-steering rounded-full flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Steering indicator line */}
          <div className="absolute w-1 h-12 bg-white top-2 left-1/2 -translate-x-1/2" />
          {/* Center dot */}
          <div className="w-6 h-6 bg-gray-700 rounded-full" />
        </div>
      </div>
      <div className="monospace text-sm text-gray-400">
        {rotation.toFixed(0)}°
      </div>
    </div>
  );
}
// built per: frontend.md, requirements.md, techstack.md
