
import type { StorySlide } from '../story-creation-store';
import { getSvgPathFromPoints, drawText, getFitDimensions, loadImage, loadVideo, generateThumbnailFromCanvas } from './render-utils';

const RENDER_WIDTH = 1080;
const RENDER_HEIGHT = 1920;

export type RenderedStoryOutput = {
  file: Blob;
  thumbnail: Blob;
  width: number;
  height: number;
  type: 'image' | 'video';
};

/**
 * Renders the final story from the editor state into an image or video file.
 * @param state The current state of the story slide from the editor.
 * @returns A promise that resolves with the rendered story output.
 */
export async function renderStory(
  state: StorySlide
): Promise<RenderedStoryOutput> {
  if (state.media.type === 'photo') {
    return renderImageStory(state);
  } else {
    return renderVideoStory(state);
  }
}

// --- Image Rendering Logic ---

async function renderImageStory(state: StorySlide): Promise<RenderedStoryOutput> {
    const canvas = new OffscreenCanvas(RENDER_WIDTH, RENDER_HEIGHT);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    // 1. Load the base image
    const image = await loadImage(state.media.url);

    // 2. Draw background and image
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
    
    const { x, y, width, height } = getFitDimensions(image.width, image.height, RENDER_WIDTH, RENDER_HEIGHT);
    ctx.drawImage(image, x, y, width, height);
    
    // 3. Render drawings
    renderDrawing(ctx, state.drawings);

    // 4. Draw text layers
    for (const text of state.texts) {
        drawText(ctx, text, RENDER_WIDTH, RENDER_HEIGHT);
    }
    
    // 5. Render Stickers (New)
    // await renderStickers(ctx, state.stickers);


    // 6. Export final image
    const file = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
    
    // 7. Generate thumbnail
    const thumbnail = await generateThumbnailFromCanvas(canvas);

    return { file, thumbnail, width: RENDER_WIDTH, height: RENDER_HEIGHT, type: 'image' };
}

// --- Video Rendering Logic ---

async function renderVideoStory(state: StorySlide): Promise<RenderedStoryOutput> {
    const video = await loadVideo(state.media.url);
    const canvas = document.createElement('canvas'); // MediaRecorder works best with a DOM canvas
    canvas.width = RENDER_WIDTH;
    canvas.height = RENDER_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    
    const renderComplete = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
    });

    recorder.start();
    video.play();

    let firstFrameCaptured = false;
    let thumbnail: Blob | null = null;
    
    const renderFrame = async () => {
        if (video.paused || video.ended) {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
            return;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
        
        const { x, y, width, height } = getFitDimensions(video.videoWidth, video.videoHeight, RENDER_WIDTH, RENDER_HEIGHT);
        ctx.drawImage(video, x, y, width, height);

        renderDrawing(ctx, state.drawings);

        for (const text of state.texts) {
            drawText(ctx, text, RENDER_WIDTH, RENDER_HEIGHT);
        }

        // Render Stickers (New)
        // await renderStickers(ctx, state.stickers);
        
        if (!firstFrameCaptured) {
            thumbnail = await generateThumbnailFromCanvas(canvas);
            firstFrameCaptured = true;
        }

        requestAnimationFrame(renderFrame);
    };

    await new Promise(resolve => {
        video.oncanplay = resolve;
    });

    renderFrame();

    await renderComplete;

    const file = new Blob(chunks, { type: 'video/webm' });

    if (!thumbnail) {
        throw new Error('Could not generate video thumbnail.');
    }

    return { file, thumbnail, width: RENDER_WIDTH, height: RENDER_HEIGHT, type: 'video' };
}


// --- Drawing Rendering ---

function renderDrawing(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, drawings: StorySlide['drawings']) {
    for (const stroke of drawings) {
        if (stroke.points.length < 2) continue;

        if (stroke.brush === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = stroke.brush === 'highlighter' ? 0.7 : 1.0;
        
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
    }
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
}
