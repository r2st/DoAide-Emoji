import { useState, useCallback } from "react";

const LETTER_MAP = {
  a: "🅰️", b: "🅱️", c: "©️", d: "🇩", e: "🇪", f: "🇫", g: "🇬",
  h: "🇭", i: "ℹ️", j: "🇯", k: "🇰", l: "🇱", m: "Ⓜ️", n: "🇳",
  o: "🅾️", p: "🅿️", q: "🇶", r: "®️", s: "🇸", t: "🇹", u: "🇺",
  v: "🇻", w: "🇼", x: "❌", y: "🇾", z: "🇿",
  "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣",
  "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣",
  "!": "❗", "?": "❓", " ": "  ",
};

const STYLES = {
  regional: {
    name: "Regional Indicators",
    transform: (text) =>
      [...text.toLowerCase()]
        .map((c) => LETTER_MAP[c] || c)
        .join(" "),
  },
  squares: {
    name: "Colored Squares",
    transform: (text) =>
      [...text.toLowerCase()]
        .map((c) => {
          if (c === " ") return "  ";
          const code = c.charCodeAt(0);
          if (code >= 97 && code <= 122) return `🟨`;
          return LETTER_MAP[c] || c;
        })
        .join(""),
  },
  sparkle: {
    name: "Sparkle Text",
    transform: (text) =>
      "✨ " +
      [...text]
        .map((c) => (c === " " ? " ✨ " : c))
        .join("") +
      " ✨",
  },
  clap: {
    name: "Clap Back",
    transform: (text) =>
      text
        .split(" ")
        .join(" 👏 "),
  },
  fire: {
    name: "Fire Text",
    transform: (text) =>
      "🔥 " +
      text
        .split(" ")
        .join(" 🔥 ") +
      " 🔥",
  },
  wave: {
    name: "Ocean Wave",
    transform: (text) =>
      "🌊 " +
      text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join("") +
      " 🌊",
  },
  hearts: {
    name: "Love Letter",
    transform: (text) =>
      "💕 " +
      text
        .split(" ")
        .join(" 💗 ") +
      " 💕",
  },
};

export default function EmojiText() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("regional");
  const [copied, setCopied] = useState(false);

  const result = text ? STYLES[style].transform(text) : "";

  const copy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emoji Text Generator
        </h2>
        <p className="text-gray-500">
          Convert your text to emoji-styled text. Perfect for social media.
        </p>
      </div>

      <input
        type="text"
        placeholder="Type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-lg"
        maxLength={100}
        autoFocus
      />

      <div className="flex flex-wrap gap-2">
        {Object.entries(STYLES).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setStyle(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              style === key
                ? "bg-gold text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xl break-all leading-relaxed mb-4">{result}</p>
          <button
            onClick={copy}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              copied
                ? "bg-green-500 text-white"
                : "bg-gold text-white hover:bg-gold-dark"
            }`}
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}

      {!text && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">🔤</p>
          <p>Type something above to see it transformed</p>
        </div>
      )}
    </div>
  );
}
