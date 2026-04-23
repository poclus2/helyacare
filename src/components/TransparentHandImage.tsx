"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Renders a JPEG image on a canvas, removing the checkerboard/grey background
 * by making light pixels transparent, so the image integrates naturally
 * into the section's cream background (#F5F0E8).
 */
export default function TransparentHandImage({ src, alt, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Section background color (#F5F0E8) = rgb(245, 240, 232)
      // The checkerboard is made of light grey (#C0C0C0-ish) and white (#FFFFFF)
      // We threshold: pixels that are light enough (high R, G, B) become transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect checkerboard: grey (~192,192,192) or white (255,255,255)
        // Both have high and similar R, G, B channels
        const isGrey = r > 160 && g > 160 && b > 160 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;

        if (isGrey) {
          data[i + 3] = 0; // fully transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = src;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={className}
      style={{ maxHeight: "100%", width: "auto" }}
    />
  );
}
