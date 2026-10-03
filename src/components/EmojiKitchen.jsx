import { useState, useMemo } from "react";

const KITCHEN_EMOJIS = [
  "😀", "😍", "😎", "🤔", "😢", "😡", "🥳", "😴", "🤮", "😱",
  "👻", "💀", "🤖", "👽", "🐶", "🐱", "🐸", "🦊", "🐷", "🐵",
  "🌈", "🔥", "❄️", "⚡", "💧", "🌟", "💎", "🎃", "🎄", "🎈",
  "❤️", "💔", "💩", "👑", "🎸", "🚀", "🌍", "🍕", "🍔", "🎂",
];

const MASHUP_MAP = {
  "😀+😍": { name: "Grinning Love", desc: "A face so happy it's in love", parts: ["😀", "😍"] },
  "😀+🔥": { name: "Fire Grin", desc: "Grinning with fiery excitement", parts: ["😀", "🔥"] },
  "😀+💀": { name: "Dead Happy", desc: "So happy it's deadly", parts: ["😀", "💀"] },
  "😀+🌈": { name: "Rainbow Smile", desc: "Pure rainbow joy", parts: ["😀", "🌈"] },
  "😍+🔥": { name: "Burning Love", desc: "Love so hot it's on fire", parts: ["😍", "🔥"] },
  "😍+❤️": { name: "Deep Love", desc: "Love multiplied", parts: ["😍", "❤️"] },
  "😍+🍕": { name: "Pizza Love", desc: "True love for pizza", parts: ["😍", "🍕"] },
  "😎+🔥": { name: "Too Cool", desc: "So cool it's hot", parts: ["😎", "🔥"] },
  "😎+💎": { name: "Diamond Cool", desc: "Icy cool like a diamond", parts: ["😎", "💎"] },
  "😎+🚀": { name: "Rocket Cool", desc: "Cool and going places", parts: ["😎", "🚀"] },
  "🤔+💡": { name: "Eureka", desc: "Thinking leads to ideas", parts: ["🤔", "💡"] },
  "🤔+🔥": { name: "Hot Take", desc: "A controversial thought", parts: ["🤔", "🔥"] },
  "😢+🌈": { name: "Hopeful Tears", desc: "Crying but there's a rainbow", parts: ["😢", "🌈"] },
  "😢+❤️": { name: "Heartache", desc: "Tears of love", parts: ["😢", "❤️"] },
  "😡+🔥": { name: "Rage Fire", desc: "Anger erupting in flames", parts: ["😡", "🔥"] },
  "😡+❄️": { name: "Cold Fury", desc: "Ice-cold anger", parts: ["😡", "❄️"] },
  "🥳+🎂": { name: "Birthday Bash", desc: "Ultimate birthday celebration", parts: ["🥳", "🎂"] },
  "🥳+🎈": { name: "Party Time", desc: "Maximum party vibes", parts: ["🥳", "🎈"] },
  "😴+☕": { name: "Need Coffee", desc: "Sleeping but needs caffeine", parts: ["😴", "☕"] },
  "😴+🌙": { name: "Sweet Dreams", desc: "Peacefully sleeping under the moon", parts: ["😴", "🌙"] },
  "👻+🎃": { name: "Spooky Season", desc: "Maximum Halloween energy", parts: ["👻", "🎃"] },
  "👻+❤️": { name: "Ghost Love", desc: "Love from beyond", parts: ["👻", "❤️"] },
  "💀+🔥": { name: "Skull Fire", desc: "Dead and lit", parts: ["💀", "🔥"] },
  "💀+💎": { name: "Crystal Skull", desc: "Precious and dangerous", parts: ["💀", "💎"] },
  "🤖+❤️": { name: "Robot Love", desc: "Even robots can love", parts: ["🤖", "❤️"] },
  "🤖+🔥": { name: "Terminator", desc: "Robot on fire", parts: ["🤖", "🔥"] },
  "🐶+❤️": { name: "Puppy Love", desc: "The purest form of love", parts: ["🐶", "❤️"] },
  "🐱+🐶": { name: "Frenemies", desc: "Cat and dog together", parts: ["🐱", "🐶"] },
  "🐸+☕": { name: "Tea Frog", desc: "But that's none of my business", parts: ["🐸", "☕"] },
  "🐸+👑": { name: "Frog Prince", desc: "A royal frog awaiting a kiss", parts: ["🐸", "👑"] },
  "🦊+🔥": { name: "Firefox", desc: "A fox on fire", parts: ["🦊", "🔥"] },
  "🐷+🍕": { name: "Pizza Pig", desc: "Living the dream", parts: ["🐷", "🍕"] },
  "🐵+🍌": { name: "Monkey Business", desc: "A monkey with its favorite snack", parts: ["🐵", "🍌"] },
  "🌈+🦄": { name: "Magical Rainbow", desc: "Pure magic and wonder", parts: ["🌈", "🦄"] },
  "🔥+❄️": { name: "Fire & Ice", desc: "Opposing forces collide", parts: ["🔥", "❄️"] },
  "🔥+💧": { name: "Steam", desc: "When fire meets water", parts: ["🔥", "💧"] },
  "⚡+💧": { name: "Thunder Storm", desc: "Electric rain", parts: ["⚡", "💧"] },
  "💎+👑": { name: "Royal Gem", desc: "Crown jewels", parts: ["💎", "👑"] },
  "❤️+💔": { name: "Love Hurts", desc: "Love is complicated", parts: ["❤️", "💔"] },
  "❤️+🔥": { name: "Burning Heart", desc: "Passionate love", parts: ["❤️", "🔥"] },
  "💩+👑": { name: "Poop King", desc: "Even poop can be royalty", parts: ["💩", "👑"] },
  "💩+🌈": { name: "Rainbow Poop", desc: "Magical and disgusting", parts: ["💩", "🌈"] },
  "🎸+🔥": { name: "Rock & Roll", desc: "Playing with fire", parts: ["🎸", "🔥"] },
  "🚀+🌍": { name: "Launch Day", desc: "Leaving Earth behind", parts: ["🚀", "🌍"] },
  "🚀+🌟": { name: "Starship", desc: "Heading for the stars", parts: ["🚀", "🌟"] },
  "🍕+🍔": { name: "Junk Food Heaven", desc: "The best combo", parts: ["🍕", "🍔"] },
  "🎂+🔥": { name: "Hot Cake", desc: "Too many candles", parts: ["🎂", "🔥"] },
};

function getMashupKey(a, b) {
  const sorted = [a, b].sort();
  return `${sorted[0]}+${sorted[1]}`;
}

export default function EmojiKitchen() {
  const [selected, setSelected] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const mashup = useMemo(() => {
    if (selected.length !== 2) return null;
    return MASHUP_MAP[getMashupKey(selected[0], selected[1])] || null;
  }, [selected]);

  const suggestions = useMemo(() => {
    if (selected.length !== 1) return [];
    const e = selected[0];
    return Object.entries(MASHUP_MAP)
      .filter(([key]) => key.includes(e))
      .map(([, val]) => val);
  }, [selected]);

  const toggle = (emoji) => {
    setSelected((prev) => {
      if (prev.includes(emoji)) return prev.filter((e) => e !== emoji);
      if (prev.length >= 2) return [prev[1], emoji];
      return [...prev, emoji];
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emoji Kitchen
        </h2>
        <p className="text-gray-500">
          Select two emojis to see a creative mashup combination.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {KITCHEN_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => toggle(emoji)}
            className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
              selected.includes(emoji)
                ? "bg-gold/20 ring-2 ring-gold scale-110"
                : "hover:bg-gray-100"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-center gap-4 text-5xl mb-4">
            <span>{selected[0]}</span>
            {selected.length === 2 && (
              <>
                <span className="text-2xl text-gold font-bold">+</span>
                <span>{selected[1]}</span>
                <span className="text-2xl text-gold font-bold">=</span>
                {mashup ? (
                  <span className="flex items-center">
                    {mashup.parts[0]}
                    <span className="text-xs mx-1">x</span>
                    {mashup.parts[1]}
                  </span>
                ) : (
                  <span className="text-3xl">
                    {selected[0]}{selected[1]}
                  </span>
                )}
              </>
            )}
          </div>
          {mashup && (
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">{mashup.name}</h3>
              <p className="text-gray-500">{mashup.desc}</p>
            </div>
          )}
          {selected.length === 2 && !mashup && (
            <p className="text-center text-gray-500">
              {selected[0]} + {selected[1]} = a unique combination!
            </p>
          )}
          <button
            onClick={() => setSelected([])}
            className="mt-4 mx-auto block text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Suggested Combinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelected(s.parts)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gold/50 hover:bg-gold/5 transition-colors text-left cursor-pointer"
              >
                <span className="text-2xl">
                  {s.parts[0]}{s.parts[1]}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length === 0 && (
        <div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gold hover:text-gold-dark font-medium cursor-pointer"
          >
            {showAll ? "Hide" : "Browse"} all mashups ({Object.keys(MASHUP_MAP).length})
          </button>
          {showAll && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {Object.values(MASHUP_MAP).map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(s.parts)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gold/50 hover:bg-gold/5 transition-colors text-left cursor-pointer"
                >
                  <span className="text-2xl">
                    {s.parts[0]}{s.parts[1]}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
