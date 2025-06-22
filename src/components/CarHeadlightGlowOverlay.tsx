import { useEffect, useRef, useState } from "react";

interface CarHeadlightGlowOverlayProps {
  width: number;
  height: number;
  intensity?: number; // 1 — ярко, 2 — экстремально ярко
}

// Координаты и размеры для фото 1200x360 (ещё выше)
const LEFT = { x: 150, y: 145, w: 340, h: 22 };
const RIGHT = { x: 710, y: 145, w: 340, h: 22 };

function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry/i.test(navigator.userAgent);
}

export default function CarHeadlightGlowOverlay({ width, height, intensity = 1 }: CarHeadlightGlowOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noCtxFilter, setNoCtxFilter] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Проверяем поддержку ctx.filter
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;
    if (ctx && typeof ctx.filter !== 'undefined') {
      setNoCtxFilter(false);
    } else {
      setNoCtxFilter(true);
    }
    setIsMobileDevice(isMobile());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // Если мобильное и нет поддержки фильтра — не рисуем glow
    if (isMobileDevice && noCtxFilter) {
      return null;
    }
    const scaleX = width / 1200;
    const scaleY = height / 360;
    drawGlow(ctx, LEFT, scaleX, scaleY, intensity, noCtxFilter);
    drawGlow(ctx, RIGHT, scaleX, scaleY, intensity, noCtxFilter);
  }, [width, height, intensity, noCtxFilter, isMobileDevice]);

  function drawGlow(ctx: CanvasRenderingContext2D, pos: {x:number,y:number,w:number,h:number}, sx: number, sy: number, alpha: number, noCtxFilter: boolean) {
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
    if (!noCtxFilter) {
      ctx.filter = "blur(40px)";
    } else {
      ctx.filter = "none";
    }
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
        zIndex: 2,
        filter: noCtxFilter && !isMobileDevice ? "blur(40px)" : undefined
      }}
    />
  );
} 