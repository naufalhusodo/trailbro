export default function Header({ onSettingsClick, onDebriefClick, debriefDisabled, practiceMode, onPracticeModeToggle }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold">TrailBro</h1>
      <div className="flex gap-2">
        <button
          onClick={onPracticeModeToggle}
          className={`px-4 py-2 rounded font-medium ${
            practiceMode 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Practice Mode: {practiceMode ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={onDebriefClick}
          disabled={debriefDisabled}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded"
        >
          Get AI Debrief
        </button>
        <button
          onClick={onSettingsClick}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
// built per: frontend.md, status.md (v1 MVP - no mode toggle, Challenge mode is v2)
