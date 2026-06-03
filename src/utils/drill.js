// Weighted random drill generator based on performance profile
export const generateTargetZone = (performanceProfile, drillCount) => {
  // Every 10th drill: fully random (wild card) - but still bias toward 5-65%
  if (drillCount > 0 && drillCount % 10 === 0) {
    // 70% chance to be in 5-65 range, 30% chance to be anywhere
    if (Math.random() < 0.7) {
      const min = 5 + Math.floor(Math.random() * 50); // 5-55
      const max = min + 10;
      return { min, max };
    } else {
      const min = Math.floor(Math.random() * 85);
      const max = min + 10 + Math.floor(Math.random() * 5);
      return { min, max };
    }
  }

  const zones = performanceProfile.zones;
  const zoneKeys = Object.keys(zones);
  
  // Calculate weights for each zone (1 - successRate)
  // Boost weight for 0-25 and 26-50 zones (covers 5-65% range)
  const weights = zoneKeys.map(key => {
    const zone = zones[key];
    let weight;
    
    if (zone.attempts === 0) {
      weight = 0.6; // Never-attempted zones get medium weight
    } else {
      weight = 1 - (zone.successes / zone.attempts);
    }
    
    // Boost weight for zones that contain 5-65% range
    if (key === '0-25' || key === '26-50' || key === '51-75') {
      weight *= 2.0; // Double the weight
    }
    
    return weight;
  });

  // Normalize weights to sum to 1.0
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map(w => w / totalWeight);

  // Weighted random selection
  const rand = Math.random();
  let cumulative = 0;
  let selectedZoneIndex = 0;

  for (let i = 0; i < normalizedWeights.length; i++) {
    cumulative += normalizedWeights[i];
    if (rand <= cumulative) {
      selectedZoneIndex = i;
      break;
    }
  }

  const selectedZoneKey = zoneKeys[selectedZoneIndex];
  const [zoneMin, zoneMax] = selectedZoneKey.split('-').map(Number);
  
  // Generate random target within selected zone
  // If in 0-25 zone, bias toward 5-25 range
  let targetMin;
  if (selectedZoneKey === '0-25') {
    targetMin = 5 + Math.floor(Math.random() * 15); // 5-20
  } else {
    targetMin = zoneMin + Math.floor(Math.random() * (zoneMax - zoneMin - 10));
  }
  
  const targetMax = targetMin + 10;

  return { min: targetMin, max: targetMax };
};

// Initialize performance profile
export const initPerformanceProfile = () => ({
  zones: {
    "0-25": { attempts: 0, successes: 0, avgOvershoot: 0 },
    "26-50": { attempts: 0, successes: 0, avgOvershoot: 0 },
    "51-75": { attempts: 0, successes: 0, avgOvershoot: 0 },
    "76-100": { attempts: 0, successes: 0, avgOvershoot: 0 }
  },
  totalDrills: 0,
  totalSuccesses: 0,
  lastUpdated: new Date().toISOString()
});

// Update performance profile after drill
export const updatePerformanceProfile = (profile, targetZone, success, peakPressure) => {
  const zoneKey = Object.keys(profile.zones).find(key => {
    const [min, max] = key.split('-').map(Number);
    return targetZone.min >= min && targetZone.max <= max;
  });

  if (zoneKey) {
    profile.zones[zoneKey].attempts++;
    if (success) {
      profile.zones[zoneKey].successes++;
    }
    const overshoot = Math.max(0, peakPressure - targetZone.max);
    profile.zones[zoneKey].avgOvershoot = 
      (profile.zones[zoneKey].avgOvershoot * (profile.zones[zoneKey].attempts - 1) + overshoot) / 
      profile.zones[zoneKey].attempts;
  }

  profile.totalDrills++;
  if (success) profile.totalSuccesses++;
  profile.lastUpdated = new Date().toISOString();

  return profile;
};
// built per: backend.md, requirements.md
