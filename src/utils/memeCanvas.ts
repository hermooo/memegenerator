import type { MemeDrawOptions } from "../types/meme";

const IMPACT_FONT = "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif";
const MAX_CANVAS_DIMENSION = 2000;

export function getBaseFontSize(canvasWidth: number, fontSizeScale: number): number {
  return Math.floor(canvasWidth * 0.07 * fontSizeScale);
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function drawTextWithShadow(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
) {
  const shadowOffsets: [number, number][] = [
    [2, 2],
    [-2, -2],
    [2, -2],
    [-2, 2],
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ];

  ctx.save();
  ctx.fillStyle = "black";
  shadowOffsets.forEach(([dx, dy]) => {
    ctx.fillText(text, x + dx, y + dy);
  });
  ctx.restore();

  ctx.strokeStyle = "black";
  ctx.lineWidth = Math.max(4, Math.floor(fontSize / 7));
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
  fontSize: number,
  position: "top" | "bottom",
) {
  const maxWidth = canvasWidth * 0.9;
  const lines = wrapLines(ctx, text, maxWidth);
  if (lines.length === 0) return;

  const lineHeight = fontSize * 1.15;
  const margin = fontSize * 0.3 + 15;
  const blockHeight = lines.length * lineHeight;
  const startY = position === "top" ? margin : canvasHeight - margin - blockHeight + fontSize * 0.1;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    drawTextWithShadow(ctx, line, canvasWidth / 2, y, fontSize);
  });
}

export function drawMemeOnCanvas(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  options: MemeDrawOptions,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const fontSize = getBaseFontSize(width, options.fontSizeScale);
  ctx.font = `bold ${fontSize}px ${IMPACT_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const format = (value: string) => (options.uppercase ? value.toUpperCase() : value);

  if (options.topText.trim()) {
    drawBlock(ctx, format(options.topText.trim()), width, height, fontSize, "top");
  }
  if (options.bottomText.trim()) {
    drawBlock(ctx, format(options.bottomText.trim()), width, height, fontSize, "bottom");
  }
}

export function scaleDimensions(
  width: number,
  height: number,
  maxDim = MAX_CANVAS_DIMENSION,
): { width: number; height: number } {
  if (width <= maxDim && height <= maxDim) {
    return { width, height };
  }
  const ratio = Math.min(maxDim / width, maxDim / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

export function loadImageForCanvas(url: string, useCors: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (useCors) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export async function renderMemeToCanvas(
  url: string,
  source: "imgflip" | "upload",
  options: MemeDrawOptions,
): Promise<HTMLCanvasElement> {
  const img = await loadImageForCanvas(url, source === "imgflip");
  const { width, height } = scaleDimensions(img.naturalWidth, img.naturalHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  drawMemeOnCanvas(ctx, img, width, height, options);
  return canvas;
}

export function triggerCanvasDownload(canvas: HTMLCanvasElement, filename = "meme.png") {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
