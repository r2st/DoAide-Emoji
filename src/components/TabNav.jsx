const TABS = [
  { id: "search", label: "Search", icon: "🔍" },
  { id: "kitchen", label: "Kitchen", icon: "🧑‍🍳" },
  { id: "text", label: "Text", icon: "🔤" },
  { id: "maker", label: "Maker", icon: "🎨" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "rain", label: "Rain", icon: "🌧️" },
];

export default function TabNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
