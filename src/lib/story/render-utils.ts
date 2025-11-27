
import type { StorySlide, TextElement, DrawingElement } from '../story-creation-store';

export const RENDER_WIDTH = 1080;
export const RENDER_HEIGHT = 1920;
export const THUMBNAIL_SIZE = 640;


export function getSvgPathFromPoints(points: DrawingElement['points']) {
  if (points.length < 2) return '';
  const d = points.reduce(
    (acc, point, i) =>
      i === 0
        ? `M ${point.x},${point.y}`
        : `${acc} L ${point.x},${point.y}`,
    ''
  );
  return d;
};


export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = 'anonymous'; // Important for tainted canvas
        img.src = src;
    });
}

export function loadVideo(src: string): Promise<HTMLVideoElement> {
     return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.onloadeddata = () => resolve(video);
        video.onerror = reject;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.loop = true;
        video.src = src;
        video.load();
    });
}

export function getFitDimensions(mediaWidth: number, mediaHeight: number, canvasWidth: number, canvasHeight: number) {
    const mediaRatio = mediaWidth / mediaHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    let width, height, x, y;

    if (mediaRatio > canvasRatio) { // Media is wider
        width = canvasWidth;
        height = width / mediaRatio;
    } else { // Media is taller
        height = canvasHeight;
        width = height * mediaRatio;
    }
    x = (canvasWidth - width) / 2;
    y = (canvasHeight - height) / 2;
    return { x, y, width, height };
}

export function drawText(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, text: TextElement, canvasWidth: number, canvasHeight: number) {
    const fontSize = RENDER_WIDTH * 0.08; // Example: 8% of canvas width
    ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
    ctx.fillStyle = text.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apply shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // Apply transformations
    const x = (text.position.x / 100) * canvasWidth;
    const y = (text.position.y / 100) * canvasHeight;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(text.rotation * (Math.PI / 180));
    ctx.scale(text.scale, text.scale);
    ctx.fillText(text.text, 0, 0);
    ctx.restore();
}

export async function generateThumbnailFromCanvas(sourceCanvas: HTMLCanvasElement | OffscreenCanvas): Promise<Blob> {
    const thumbCanvas = new OffscreenCanvas(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not create thumbnail context');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);

    const { x, y, width, height } = getFitDimensions(sourceCanvas.width, sourceCanvas.height, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    ctx.drawImage(sourceCanvas, x, y, width, height);
    
    return thumbCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
}
