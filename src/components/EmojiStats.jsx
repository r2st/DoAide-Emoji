import { useState, useMemo } from "react";

const EMOJI_REGEX = /(?:\p{Emoji_Presentation}|\p{Emoji}️)(?:‍(?:\p{Emoji_Presentation}|\p{Emoji}️))*/gu;

const SENTIMENT = {
  positive: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤗", "🥳", "😎", "🤠", "👍", "👏", "🙌", "🎉", "❤️", "💕", "💗", "💖", "💘", "💝", "💓", "💞", "🧡", "💛", "💚", "💙", "💜", "🤍", "🩷", "🩵", "✨", "🌟", "⭐", "🔥", "💯", "✅", "🥇", "🏆", "🎊", "💎", "🌈", "🥹"],
  negative: ["😢", "😭", "😡", "😠", "🤬", "😤", "😰", "😥", "😟", "😕", "😩", "😫", "😖", "😣", "😞", "😓", "😔", "👎", "💔", "😱", "😨", "😦", "😧", "😮‍💨", "🤮", "🤢", "😵", "😵‍💫", "🤕", "🤒", "❌", "⚠️", "👿", "💀"],
  neutral: ["🤔", "😐", "😑", "😶", "🙄", "😏", "😬", "🫠", "🫤", "😮", "😯", "😲", "😳", "🥺", "🤐", "🤨", "👀", "💬", "💭"],
};

function classifyEmoji(emoji) {
  if (SENTIMENT.positive.includes(emoji)) return "positive";
  if (SENTIMENT.negative.includes(emoji)) return "negative";
  if (SENTIMENT.neutral.includes(emoji)) return "neutral";
  return "other";
}

export default function EmojiStats() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    if (!text.trim()) return null;

    const matches = text.match(EMOJI_REGEX) || [];
    if (matches.length === 0) return { total: 0, unique: 0, emojis: [], freq: {}, sentiment: {} };

    const freq = {};
    for (const e of matches) {
      freq[e] = (freq[e] || 0) + 1;
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const sentiment = { positive: 0, negative: 0, neutral: 0, other: 0 };
    for (const e of matches) {
      sentiment[classifyEmoji(e)]++;
    }

    const total = matches.length;
    const charCount = [...text].length;
    const emojiDensity = charCount > 0 ? ((total / charCount) * 100).toFixed(1) : 0;

    return {
      total,
      unique: Object.keys(freq).length,
      sorted,
      sentiment,
      emojiDensity,
      topEmoji: sorted[0]?.[0] || null,
    };
  }, [text]);

  const sentimentLabel = useMemo(() => {
    if (!stats || stats.total === 0) return null;
    const { positive, negative } = stats.sentiment;
    if (positive > negative * 2) return { text: "Very Positive", color: "text-green-600", icon: "😄" };
    if (positive > negative) return { text: "Positive", color: "text-green-500", icon: "🙂" };
    if (negative > positive * 2) return { text: "Very Negative", color: "text-red-600", icon: "😤" };
    if (negative > positive) return { text: "Negative", color: "text-red-500", icon: "😕" };
    return { text: "Neutral", color: "text-gray-500", icon: "😐" };
  }, [stats]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emoji Stats
        </h2>
        <p className="text-gray-500">
          Paste text to see emoji usage statistics and sentiment analysis.
        </p>
      </div>

      <textarea
        placeholder="Paste your text with emojis here... 😀🎉❤️"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-lg resize-y"
        autoFocus
      />

      {stats && stats.total > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Emojis" value={stats.total} icon="📊" />
            <StatCard label="Unique" value={stats.unique} icon="🎯" />
            <StatCard label="Density" value={`${stats.emojiDensity}%`} icon="📏" />
            <StatCard label="Top Emoji" value={stats.topEmoji} icon="👑" />
          </div>

          {sentimentLabel && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <span className="text-4xl mb-2 block">{sentimentLabel.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Sentiment</h3>
              <p className={`text-xl font-bold ${sentimentLabel.color}`}>
                {sentimentLabel.text}
              </p>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="text-green-600">
                  {stats.sentiment.positive} positive
                </span>
                <span className="text-red-500">
                  {stats.sentiment.negative} negative
                </span>
                <span className="text-gray-500">
                  {stats.sentiment.neutral} neutral
                </span>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Frequency
            </h3>
            <div className="space-y-2">
              {stats.sorted.map(([emoji, count]) => (
                <div key={emoji} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div
                      className="h-6 bg-gold/20 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-gold rounded-full transition-all"
                        style={{
                          width: `${(count / stats.total) * 100}%`,
                          minWidth: "1rem",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 tabular-nums w-16 text-right">
                    {count} ({((count / stats.total) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {stats && stats.total === 0 && text.trim() && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">🤷</p>
          <p>No emojis found in your text</p>
        </div>
      )}

      {!text.trim() && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📊</p>
          <p>Paste some text with emojis to see statistics</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
      <span className="text-2xl block mb-1">{icon}</span>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
