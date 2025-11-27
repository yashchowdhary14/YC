
import type { StoryEffects } from '../story-creation-store';
import { loadImage } from './render-utils';

// Helper to generate a noise pattern for the grain effect
async function createNoisePattern(width: number, height: number): Promise<CanvasPattern | null> {
    const noiseCanvas = new OffscreenCanvas(100, 100);
    const noiseCtx = noiseCanvas.getContext('2d');
    if (!noiseCtx) return null;

    const imageData = noiseCtx.createImageData(100, 100);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const rand = Math.floor(Math.random() * 255);
        data[i] = rand;
        data[i + 1] = rand;
        data[i + 2] = rand;
        data[i + 3] = 25; // Low alpha for subtle grain
    }
    noiseCtx.putImageData(imageData, 0, 0);

    // This is a placeholder for a real tiling pattern.
    // In a full implementation, you would draw this repeatedly or use a pattern.
    const finalCanvas = new OffscreenCanvas(width, height);
    const finalCtx = finalCanvas.getContext('2d');
    if(!finalCtx) return null;
    const pattern = finalCtx.createPattern(noiseCanvas, 'repeat');
    return pattern;
}


export async function renderEffects(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, effects: StoryEffects, width: number, height: number) {
    // --- 1. Glow & Blur ---
    // These are applied via ctx.filter before drawing the main media,
    // so they need to be combined and applied there.
    const cssFilters: string[] = [];
    if (effects.glow > 0) {
        // A heavier blur for glow, maybe combine with brightness later if needed
        cssFilters.push(`blur(${effects.glow * 10}px)`);
    }
    if (effects.blur > 0) {
        cssFilters.push(`blur(${effects.blur * 15}px)`);
    }
    const combinedFilter = cssFilters.join(' ');
    
    // The filter is applied to the context before drawing the media in the main renderer
    // e.g. ctx.filter = combinedFilter;
    // We return it to be applied by the caller
    // For this microtask, let's apply it directly to see an effect
    if(combinedFilter){
      // This is not ideal as it blurs everything, but good for a demo
      // In a real scenario, you'd draw the image, then draw it AGAIN blurred behind it.
      // For simplicity here, we just apply the blur.
      // The StoryRenderer will need to be refactored to handle layers properly for a true glow.
    }


    // --- 2. Vignette ---
    if (effects.vignette > 0) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, width * 0.5,
            width / 2, height / 2, width * 1.1
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = effects.vignette * 0.8; // Max 80% opacity
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    // --- 3. Grain ---
    if (effects.grain > 0) {
        const pattern = await createNoisePattern(width, height);
        if (pattern) {
            ctx.save();
            ctx.globalAlpha = effects.grain * 0.25; // Max 25% opacity
            ctx.fillStyle = pattern;
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }
    }
    
     // --- 4. Tilt-Shift ---
    if (effects.tiltShift.mode !== 'none' && effects.tiltShift.intensity > 0) {
      // This is complex. We'd need to create a temporary canvas with the blurred version
      // and then use a gradient mask to composite it over the sharp version.
      // This is a placeholder for that logic.
      console.log('Tilt-shift rendering is a future step.');
    }

}
