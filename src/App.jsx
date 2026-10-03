import { useState } from "react";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import EmojiSearch from "./components/EmojiSearch";
import EmojiKitchen from "./components/EmojiKitchen";
import EmojiText from "./components/EmojiText";
import EmojiMaker from "./components/EmojiMaker";
import EmojiStats from "./components/EmojiStats";
import EmojiRain from "./components/EmojiRain";

const TOOLS = {
  search: EmojiSearch,
  kitchen: EmojiKitchen,
  text: EmojiText,
  maker: EmojiMaker,
  stats: EmojiStats,
  rain: EmojiRain,
};

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const ActiveTool = TOOLS[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ActiveTool />
      </main>
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>
            Made with ❤️ by{" "}
            <a href="https://doaide.com" className="text-gold hover:text-gold-dark no-underline">
              DoAide
            </a>
            {" "}— Free, no login required
          </p>
        </div>
      </footer>
    </div>
  );
}
