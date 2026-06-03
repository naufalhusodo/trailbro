// Calculate consistency score from pressure samples
export const calculateConsistencyScore = (pressureSamples) => {
  if (pressureSamples.length < 2) return 0;

  // Calculate mean
  const mean = pressureSamples.reduce((sum, val) => sum + val, 0) / pressureSamples.length;

  // Calculate standard deviation
  const variance = pressureSamples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pressureSamples.length;
  const stdDev = Math.sqrt(variance);

  // Map to 0-100 scale (lower std dev = higher score)
  // Typical std dev range: 0-10, invert and scale
  const score = Math.max(0, Math.min(100, 100 - (stdDev * 10)));

  return Math.round(score);
};

// Calculate rolling consistency score across session
export const calculateRollingConsistency = (sessionData) => {
  if (sessionData.length === 0) return 0;

  // Collect all successful drill peak pressures
  const successfulPressures = sessionData
    .filter(drill => drill.success)
    .map(drill => drill.peakPressure);

  if (successfulPressures.length < 2) return 0;

  return calculateConsistencyScore(successfulPressures);
};
// built per: backend.md, requirements.md
