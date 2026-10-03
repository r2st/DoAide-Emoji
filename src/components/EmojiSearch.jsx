import { useState, useEffect, useCallback } from "react";
import EMOJI_DATA from "../data/emojis";

const RECENT_KEY = "doaide-emoji-recent";

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function addRecent(emoji) {
  const recent = getRecent().filter((e) => e !== emoji);
  recent.unshift(emoji);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 30)));
  } catch {}
}

export default function EmojiSearch() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(getRecent());
  }, []);

  const results = query.trim()
    ? EMOJI_DATA.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.keywords.some((k) => k.includes(q))
        );
      })
    : EMOJI_DATA;

  const copy = useCallback(
    async (emoji) => {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      addRecent(emoji);
      setRecent(getRecent());
      setTimeout(() => setCopied(null), 1500);
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emoji Search
        </h2>
        <p className="text-gray-500">
          Search emojis by name or keyword. Click to copy.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search emojis... (e.g. happy, fire, heart)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-lg"
        autoFocus
      />

      {recent.length > 0 && !query && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Recently Used
          </h3>
          <div className="flex flex-wrap gap-1">
            {recent.map((emoji, i) => (
              <button
                key={i}
                onClick={() => copy(emoji)}
                className="text-2xl p-2 rounded-lg hover:bg-gold/10 transition-colors cursor-pointer"
                title="Click to copy"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {query ? `Results (${results.length})` : "All Emojis"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {results.map((e, i) => (
            <button
              key={i}
              onClick={() => copy(e.emoji)}
              className={`text-2xl p-2 rounded-lg transition-all cursor-pointer ${
                copied === e.emoji
                  ? "bg-green-100 scale-110"
                  : "hover:bg-gold/10"
              }`}
              title={`${e.name} — click to copy`}
            >
              {e.emoji}
            </button>
          ))}
        </div>
        {results.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No emojis found for &quot;{query}&quot;
          </p>
        )}
      </div>

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          Copied {copied} to clipboard!
        </div>
      )}
    </div>
  );
}
