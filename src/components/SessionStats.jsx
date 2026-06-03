export default function SessionStats({ performanceProfile, consistencyScore, sessionData }) {
  const totalDrills = performanceProfile.totalDrills;
  const totalSuccesses = performanceProfile.totalSuccesses;
  const successRate = totalDrills > 0 ? Math.round((totalSuccesses / totalDrills) * 100) : 0;

  // Calculate current streak
  let currentStreak = 0;
  for (let i = sessionData.length - 1; i >= 0; i--) {
    if (sessionData[i].success) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Zone heatmap colors based on success rate
  const getZoneColor = (zone) => {
    if (zone.attempts === 0) return 'bg-gray-700';
    const rate = zone.successes / zone.attempts;
    if (rate >= 0.8) return 'bg-green-600';
    if (rate >= 0.6) return 'bg-yellow-600';
    if (rate >= 0.4) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Session Stats</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-1">Consistency</p>
          <p className="text-2xl font-bold monospace">{consistencyScore}</p>
        </div>
        
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-1">Total Drills</p>
          <p className="text-2xl font-bold monospace">{totalDrills}</p>
        </div>
        
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-1">Success Rate</p>
          <p className="text-2xl font-bold monospace">{successRate}%</p>
        </div>
        
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-1">Streak</p>
          <p className="text-2xl font-bold monospace">{currentStreak}</p>
        </div>
      </div>

      {/* Zone Weakness Heatmap */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Zone Performance</p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(performanceProfile.zones).map(([key, zone]) => {
            const rate = zone.attempts > 0 ? Math.round((zone.successes / zone.attempts) * 100) : 0;
            return (
              <div key={key} className={`${getZoneColor(zone)} p-3 rounded text-center`}>
                <p className="text-xs font-bold">{key}%</p>
                <p className="text-lg font-bold monospace">{rate}%</p>
                <p className="text-xs opacity-75">{zone.attempts} tries</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// built per: frontend.md, requirements.md, backend.md
