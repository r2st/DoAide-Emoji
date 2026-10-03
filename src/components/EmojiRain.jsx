import { useState, useEffect, useRef, useCallback } from "react";

const PRESET_SETS = [
  { name: "Party", emojis: ["🎉", "🎊", "🥳", "🎈", "🎆", "✨"] },
  { name: "Love", emojis: ["❤️", "💕", "💗", "💖", "😍", "🥰"] },
  { name: "Nature", emojis: ["🌸", "🌺", "🌻", "🌷", "🌹", "🍀"] },
  { name: "Weather", emojis: ["☀️", "🌧️", "❄️", "⚡", "🌈", "🌪️"] },
  { name: "Food", emojis: ["🍕", "🍔", "🍟", "🌭", "🍩", "🍿"] },
  { name: "Animals", emojis: ["🐶", "🐱", "🐸", "🦊", "🐼", "🦄"] },
  { name: "Money", emojis: ["💰", "💵", "💎", "🤑", "💲", "👑"] },
  { name: "Spooky", emojis: ["👻", "💀", "🎃", "🕷️", "🦇", "😱"] },
];

export default function EmojiRain() {
  const [selectedEmojis, setSelectedEmojis] = useState(PRESET_SETS[0].emojis);
  const [isRaining, setIsRaining] = useState(false);
  const [drops, setDrops] = useState([]);
  const [speed, setSpeed] = useState(3);
  const [density, setDensity] = useState(5);
  const animRef = useRef(null);
  const containerRef = useRef(null);
  const nextId = useRef(0);

  const toggleEmoji = useCallback((emoji) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji],
    );
  }, []);

  useEffect(() => {
    if (!isRaining) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastSpawn = 0;
    const spawnInterval = 1000 / density;

    const animate = (time) => {
      if (time - lastSpawn > spawnInterval) {
        lastSpawn = time;
        const container = containerRef.current;
        if (container) {
          const width = container.offsetWidth;
          setDrops((prev) => [
            ...prev.filter((d) => d.y < window.innerHeight + 50),
            {
              id: nextId.current++,
              emoji: selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)],
              x: Math.random() * (width - 40),
              y: -50,
              size: 20 + Math.random() * 24,
              speed: speed * (0.5 + Math.random()),
              rotation: Math.random() * 360,
              rotSpeed: (Math.random() - 0.5) * 4,
            },
          ]);
        }
      }

      setDrops((prev) =>
        prev
          .map((d) => ({
            ...d,
            y: d.y + d.speed,
            rotation: d.rotation + d.rotSpeed,
          }))
          .filter((d) => d.y < window.innerHeight + 50),
      );

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRaining, selectedEmojis, speed, density]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emoji Rain
        </h2>
        <p className="text-gray-500">
          Pick your emojis and watch them rain down! Pure fun.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_SETS.map((set) => (
            <button
              key={set.name}
              onClick={() => setSelectedEmojis(set.emojis)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                JSON.stringify(selectedEmojis) === JSON.stringify(set.emojis)
                  ? "bg-gold text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {set.emojis[0]} {set.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          Custom Selection
        </h3>
        <div className="flex flex-wrap gap-1">
          {PRESET_SETS.flatMap((s) => s.emojis)
            .filter((e, i, a) => a.indexOf(e) === i)
            .map((emoji) => (
              <button
                key={emoji}
                onClick={() => toggleEmoji(emoji)}
                className={`text-2xl p-2 rounded-lg transition-all cursor-pointer ${
                  selectedEmojis.includes(emoji)
                    ? "bg-gold/20 ring-2 ring-gold"
                    : "hover:bg-gray-100"
                }`}
              >
                {emoji}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Speed: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Density: {density}/s
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full accent-gold"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRaining(!isRaining)}
          disabled={selectedEmojis.length === 0}
          className={`px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer ${
            isRaining
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gold text-white hover:bg-gold-dark"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRaining ? "Stop Rain" : "Start Rain!"}
        </button>
        {isRaining && (
          <button
            onClick={() => {
              setIsRaining(false);
              setDrops([]);
            }}
            className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden"
        style={{ height: 400 }}
      >
        {drops.map((drop) => (
          <span
            key={drop.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: drop.x,
              top: drop.y,
              fontSize: drop.size,
              transform: `rotate(${drop.rotation}deg)`,
              willChange: "transform",
            }}
          >
            {drop.emoji}
          </span>
        ))}
        {!isRaining && drops.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">🌧️</p>
              <p>Click &quot;Start Rain&quot; to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
