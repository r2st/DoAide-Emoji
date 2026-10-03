import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = [
  "#F0B429", "#EF4444", "#3B82F6", "#10B981", "#8B5CF6",
  "#EC4899", "#F97316", "#14B8A6", "#000000", "#FFFFFF",
];

const SHAPES = ["circle", "square", "triangle", "star", "heart"];
const BG_COLORS = ["transparent", "#FFFFFF", "#F0B429", "#EF4444", "#3B82F6", "#10B981", "#000000"];

export default function EmojiMaker() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#F0B429");
  const [bgColor, setBgColor] = useState("transparent");
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shape, setShape] = useState("circle");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor === "transparent" ? "#FFFFFF" : bgColor;
    ctx.fillRect(0, 0, 128, 128);
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 128 / rect.width;
    const scaleY = 128 / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDraw = useCallback(
    (e) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getPos(e);
      const ctx = canvasRef.current.getContext("2d");

      if (tool === "brush" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = tool === "eraser" ? (bgColor === "transparent" ? "#FFFFFF" : bgColor) : color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    },
    [tool, color, bgColor, brushSize, getPos],
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      const ctx = canvasRef.current.getContext("2d");

      if (tool === "brush" || tool === "eraser") {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    },
    [isDrawing, tool, getPos],
  );

  const stopDraw = useCallback(() => setIsDrawing(false), []);

  const addShape = useCallback(
    (shapeType) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      const cx = 64, cy = 64, s = 30;

      switch (shapeType) {
        case "circle":
          ctx.beginPath();
          ctx.arc(cx, cy, s, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "square":
          ctx.fillRect(cx - s, cy - s, s * 2, s * 2);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(cx, cy - s);
          ctx.lineTo(cx + s, cy + s);
          ctx.lineTo(cx - s, cy + s);
          ctx.closePath();
          ctx.fill();
          break;
        case "star":
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const method = i === 0 ? "moveTo" : "lineTo";
            ctx[method](cx + s * Math.cos(angle), cy + s * Math.sin(angle));
          }
          ctx.closePath();
          ctx.fill();
          break;
        case "heart":
          ctx.beginPath();
          ctx.moveTo(cx, cy + s * 0.7);
          ctx.bezierCurveTo(cx - s * 1.2, cy - s * 0.3, cx - s * 0.5, cy - s, cx, cy - s * 0.4);
          ctx.bezierCurveTo(cx + s * 0.5, cy - s, cx + s * 1.2, cy - s * 0.3, cx, cy + s * 0.7);
          ctx.fill();
          break;
      }
    },
    [color],
  );

  const addEmoji = useCallback((emoji) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 64, 64);
  }, []);

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = bgColor === "transparent" ? "#FFFFFF" : bgColor;
    ctx.fillRect(0, 0, 128, 128);
  }, [bgColor]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "emoji.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Custom Emoji Maker
        </h2>
        <p className="text-gray-500">
          Draw your own emoji! Download as PNG.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
          <div
            className="border-2 border-gray-300 rounded-2xl overflow-hidden mx-auto"
            style={{
              width: 256,
              height: 256,
              background: bgColor === "transparent"
                ? "repeating-conic-gradient(#E5E5E5 0% 25%, white 0% 50%) 0 0 / 16px 16px"
                : bgColor,
            }}
          >
            <canvas
              ref={canvasRef}
              width={128}
              height={128}
              style={{ width: 256, height: 256, cursor: "crosshair", touchAction: "none" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Tool</label>
            <div className="flex gap-2">
              {[
                { id: "brush", label: "Brush", icon: "🖌️" },
                { id: "eraser", label: "Eraser", icon: "🧹" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    tool === t.id ? "bg-gold text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Brush Size: {brushSize}px
            </label>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c ? "border-gray-900 scale-110" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Background</label>
            <div className="flex flex-wrap gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    bgColor === c ? "border-gray-900 scale-110" : "border-gray-200"
                  } ${c === "transparent" ? "bg-[repeating-conic-gradient(#E5E5E5_0%_25%,white_0%_50%)]" : ""}`}
                  style={c !== "transparent" ? { backgroundColor: c } : {}}
                  title={c === "transparent" ? "Transparent" : c}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Add Shape</label>
            <div className="flex gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s}
                  onClick={() => addShape(s)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer capitalize"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Quick Add Emoji</label>
            <div className="flex gap-1">
              {["😀", "❤️", "⭐", "🔥", "👑", "🌈", "💎", "🎵"].map((e) => (
                <button
                  key={e}
                  onClick={() => addEmoji(e)}
                  className="text-xl p-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={download}
              className="px-6 py-2 rounded-full bg-gold text-white hover:bg-gold-dark text-sm font-medium cursor-pointer"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
