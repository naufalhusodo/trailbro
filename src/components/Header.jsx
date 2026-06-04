export default function Header({ onSettingsClick }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold monospace">TrailBro</h1>
      <div className="flex gap-2">
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