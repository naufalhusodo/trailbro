export default function SteeringWheel({ steeringValue, lockToLock, wheelVariant }) {
  const rotation = steeringValue * (lockToLock / 2);
  const wheelSrc = `${import.meta.env.BASE_URL}icons/${encodeURIComponent(wheelVariant)}/Wheel.png`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-48">
        <img
          src={wheelSrc}
          alt="Steering Wheel"
          className="w-full h-full object-contain select-none pointer-events-none"
          style={{ transform: `rotate(${rotation}deg)` }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      <div className="monospace text-sm text-gray-400">
        {rotation.toFixed(0)}°
      </div>
    </div>
  );
}
// built per: frontend.md, requirements.md, techstack.md
