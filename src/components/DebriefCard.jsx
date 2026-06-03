import { useState } from 'react';

export default function DebriefCard({ sessionData, performanceProfile, consistencyScore, onClose }) {
  const [debrief, setDebrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDebrief = async () => {
    setLoading(true);
    setError('');

    try {
      const summary = {
        totalDrills: performanceProfile.totalDrills,
        totalSuccesses: performanceProfile.totalSuccesses,
        successRate: performanceProfile.totalDrills > 0 
          ? (performanceProfile.totalSuccesses / performanceProfile.totalDrills * 100).toFixed(1)
          : 0,
        consistencyScore,
        zones: performanceProfile.zones,
        recentDrills: sessionData.slice(-10)
      };

      const prompt = {
        contents: [{
          parts: [{
            text: `You are a professional trail braking coach. Provide concise, actionable feedback (3-5 sentences) based on this session data:

${JSON.stringify(summary, null, 2)}

Focus on:
- Pressure consistency (their score: ${consistencyScore}/100)
- Overshoot patterns
- Release technique
- Zone weaknesses

Be specific and encouraging. Use second person ("you").`
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
        setDebrief(text);
      } else {
        setError('Unable to generate debrief. Please try again.');
      }
    } catch (err) {
      setError('AI coaching unavailable. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Session Debrief</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {!debrief && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Get AI-powered coaching feedback on your session</p>
            <button
              onClick={fetchDebrief}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium"
            >
              Generate Debrief
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing your session...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {debrief && (
          <div className="bg-gray-800 rounded p-4 whitespace-pre-wrap">
            <p className="text-gray-100 leading-relaxed">{debrief}</p>
          </div>
        )}

        {debrief && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
// built per: frontend.md, backend.md, requirements.md, flow.md
