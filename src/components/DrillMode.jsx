import { useState, useEffect, useRef } from 'react';
import { generateTargetZone, initPerformanceProfile, updatePerformanceProfile } from '../utils/drill';
import { calculateConsistencyScore, calculateRollingConsistency } from '../utils/consistency';

export default function DrillMode({ currentPressure, onDrillComplete }) {
  const [targetZone, setTargetZone] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [drillState, setDrillState] = useState('ready'); // ready, active, success, fail
  const [performanceProfile, setPerformanceProfile] = useState(() => {
    const saved = localStorage.getItem('simbrake-performance');
    return saved ? JSON.parse(saved) : initPerformanceProfile();
  });
  const [consistencyScore, setConsistencyScore] = useState(0);

  const holdStartTimeRef = useRef(null);
  const drillStartTimeRef = useRef(null);
  const peakPressureRef = useRef(0);
  const sessionDataRef = useRef([]);
  const inZoneSamplesRef = useRef([]);
  const adaptiveDrillQueueRef = useRef([]);
  const monitorRafRef = useRef(null);
  const currentPressureRef = useRef(0);

  // Keep current pressure in ref for RAF loop
  useEffect(() => {
    currentPressureRef.current = currentPressure;
  }, [currentPressure]);

  // Initialize first drill
  useEffect(() => {
    if (!targetZone) {
      startNewDrill();
    }
  }, []);

  // Continuous pressure monitoring loop
  useEffect(() => {
    if (drillState !== 'active' || !targetZone) return;

    const monitorPressure = () => {
      const pressure = currentPressureRef.current;
      const isInZone = pressure >= targetZone.min && pressure <= targetZone.max;
      
      // Track peak pressure
      if (pressure > peakPressureRef.current) {
        peakPressureRef.current = pressure;
      }

      if (isInZone) {
        // Collect pressure samples while in zone
        inZoneSamplesRef.current.push(pressure);

        // Start or continue hold timer
        if (!holdStartTimeRef.current) {
          holdStartTimeRef.current = Date.now();
        }
        
        const elapsed = (Date.now() - holdStartTimeRef.current) / 1000;
        setHoldProgress(Math.min(elapsed, 1));

        // Success: held for 1 second
        if (elapsed >= 1.0) {
          completeDrill(true);
          return; // Stop monitoring
        }
      } else {
        // Outside zone: reset hold timer
        holdStartTimeRef.current = null;
        setHoldProgress(0);
      }

      // Timeout: 5 seconds elapsed
      const totalElapsed = (Date.now() - drillStartTimeRef.current) / 1000;
      if (totalElapsed >= 5.0) {
        completeDrill(false);
        return; // Stop monitoring
      }

      monitorRafRef.current = requestAnimationFrame(monitorPressure);
    };

    monitorRafRef.current = requestAnimationFrame(monitorPressure);

    return () => {
      if (monitorRafRef.current) {
        cancelAnimationFrame(monitorRafRef.current);
      }
    };
  }, [drillState, targetZone]);

  const startNewDrill = () => {
    let newTarget;

    // Check if we have adaptive drill queue
    if (adaptiveDrillQueueRef.current.length > 0) {
      const targetMidpoint = adaptiveDrillQueueRef.current.shift();
      newTarget = { min: targetMidpoint - 5, max: targetMidpoint + 5 };
    } else {
      newTarget = generateTargetZone(performanceProfile, performanceProfile.totalDrills);
    }

    setTargetZone(newTarget);
    setHoldProgress(0);
    setDrillState('active');
    holdStartTimeRef.current = null;
    drillStartTimeRef.current = Date.now();
    peakPressureRef.current = 0;
    inZoneSamplesRef.current = [];
  };

  const fetchAdaptiveDrillPlan = async (profile) => {
    try {
      const prompt = {
        contents: [{
          parts: [{
            text: `You are a trail braking coach. Based on this performance profile, create a drill plan for the next 10 drills. Return ONLY valid JSON with this exact structure:
{
  "focusZone": "0-25" | "26-50" | "51-75" | "76-100",
  "drillSequence": [array of 10 numbers between 0-100 representing target midpoints],
  "reasoning": "brief explanation"
}

Performance profile:
${JSON.stringify(profile, null, 2)}

Focus on the weakest zone. Ensure drillSequence contains exactly 10 numbers.`
          }]
        }]
      };

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        // Extract JSON from response (may be wrapped in markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const plan = JSON.parse(jsonMatch[0]);
          if (plan.drillSequence && Array.isArray(plan.drillSequence)) {
            adaptiveDrillQueueRef.current = plan.drillSequence;
            console.log('Adaptive drill plan loaded:', plan.reasoning);
          }
        }
      }
    } catch (error) {
      console.error('Adaptive drill plan failed:', error);
      // Fall back to weighted random
    }
  };

  const completeDrill = (success) => {
    const drillDuration = (Date.now() - drillStartTimeRef.current) / 1000;
    
    // Calculate drill consistency score
    const drillConsistency = calculateConsistencyScore(inZoneSamplesRef.current);
    
    // Log drill result
    const drillResult = {
      drillIndex: performanceProfile.totalDrills,
      targetZone,
      peakPressure: peakPressureRef.current,
      holdDuration: drillDuration,
      success,
      overshoot: Math.max(0, peakPressureRef.current - targetZone.max),
      consistencyScore: drillConsistency,
      timestamp: Date.now()
    };
    
    sessionDataRef.current.push(drillResult);

    // Update performance profile
    const updatedProfile = updatePerformanceProfile(
      { ...performanceProfile },
      targetZone,
      success,
      peakPressureRef.current
    );
    
    setPerformanceProfile(updatedProfile);
    localStorage.setItem('simbrake-performance', JSON.stringify(updatedProfile));

    // Calculate rolling consistency
    const rollingConsistency = calculateRollingConsistency(sessionDataRef.current);
    setConsistencyScore(rollingConsistency);

    // Every 20 drills: fetch adaptive drill plan
    if (updatedProfile.totalDrills > 0 && updatedProfile.totalDrills % 20 === 0) {
      fetchAdaptiveDrillPlan(updatedProfile);
    }

    // Notify parent
    if (onDrillComplete) {
      onDrillComplete(drillResult, sessionDataRef.current);
    }

    // Update state and start next drill after brief delay
    setDrillState(success ? 'success' : 'fail');
    setTimeout(() => {
      startNewDrill();
    }, 500);
  };

  return {
    targetZone,
    holdProgress,
    drillState,
    performanceProfile,
    sessionData: sessionDataRef.current,
    consistencyScore
  };
}
// built per: requirements.md, backend.md, flow.md
