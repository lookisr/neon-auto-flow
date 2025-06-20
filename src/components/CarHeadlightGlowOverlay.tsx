import { useEffect, useRef } from "react";

interface CarHeadlightGlowOverlayProps {
  width: number;
  height: number;
  intensity?: number; // 1 — ярко, 2 — экстремально ярко
}

// Координаты и размеры для фото 1200x360 (ещё выше)
const LEFT = { x: 150, y: 145, w: 340, h: 22 };
const RIGHT = { x: 710, y: 145, w: 340, h: 22 };

export default function CarHeadlightGlowOverlay({ width, height, intensity = 1 }: CarHeadlightGlowOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const scaleX = width / 1200;
    const scaleY = height / 360;
    drawGlow(ctx, LEFT, scaleX, scaleY, intensity);
    drawGlow(ctx, RIGHT, scaleX, scaleY, intensity);
  }, [width, height, intensity]);

  function drawGlow(ctx: CanvasRenderingContext2D, pos: {x:number,y:number,w:number,h:number}, sx: number, sy: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = Math.min(alpha, 2); // максимум 2
    ctx.beginPath();
    ctx.ellipse(pos.x * sx + (pos.w * sx)/2, pos.y * sy + (pos.h * sy)/2, (pos.w * sx)/2, (pos.h * sy)/2, 0, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(
      pos.x * sx + (pos.w * sx)/2,
      pos.y * sy + (pos.h * sy)/2,
      0,
      pos.x * sx + (pos.w * sx)/2,
      pos.y * sy + (pos.h * sy)/2,
      (pos.w * sx)/0.35
    );
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.8, "#fff");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.filter = "blur(40px)";
    ctx.fill();
    ctx.restore();
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2
      }}
    />
  );
} 