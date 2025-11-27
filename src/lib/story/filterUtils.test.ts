import { describe, it, expect } from 'vitest';
import { interpolateFilter, clamp01 } from './filterUtils';

describe('clamp01', () => {
    it('should return the number if it is between 0 and 1', () => {
        expect(clamp01(0.5)).toBe(0.5);
    });
    it('should return 0 if the number is less than 0', () => {
        expect(clamp01(-0.5)).toBe(0);
    });
    it('should return 1 if the number is greater than 1', () => {
        expect(clamp01(1.5)).toBe(1);
    });
    it('should handle edges cases 0 and 1', () => {
        expect(clamp01(0)).toBe(0);
        expect(clamp01(1)).toBe(1);
    });
});

describe('interpolateFilter', () => {
    it('Case 1: Full to Half intensity (normal interpolation)', () => {
        const result = interpolateFilter("brightness(1.2) contrast(1.4)", 0.5);
        // brightness = 1 + (0.2 * 0.5) = 1.1
        // contrast = 1 + (0.4 * 0.5) = 1.2
        expect(result).toBe("brightness(1.1) contrast(1.2)");
    });

    it('Case 2: Zero intensity', () => {
        const result = interpolateFilter("brightness(1.5) saturate(1.8)", 0);
        expect(result).toBe("none");
    });
    
    it('Case 3: Full intensity', () => {
        const result = interpolateFilter("brightness(1.5) saturate(1.8)", 1);
        expect(result).toBe("brightness(1.5) saturate(1.8)");
    });

    it('Case 4: blur interpolation', () => {
        const result = interpolateFilter("blur(4px)", 0.25);
        expect(result).toBe("blur(1px)");
    });

    it('Case 5: hue-rotate interpolation', () => {
        const result = interpolateFilter("hue-rotate(90deg)", 0.5);
        expect(result).toBe("hue-rotate(45deg)");
    });

    it('Case 6: mixed filter string', () => {
        const result = interpolateFilter("brightness(1.05) sepia(0.2) blur(2px)", 0.5);
        // brightness -> 1 + (0.05 * 0.5) = 1.025
        // sepia -> 0.2 * 0.5 = 0.1
        // blur -> 2 * 0.5 = 1
        expect(result).toBe("brightness(1.025) sepia(0.1) blur(1px)");
    });

    it('Case 7: unsupported functions are ignored', () => {
        const result = interpolateFilter("drop-shadow(2px 4px 6px black) brightness(1.2)", 0.5);
        // drop-shadow is ignored
        // brightness -> 1 + (0.2 * 0.5) = 1.1
        expect(result).toBe("brightness(1.1)");
    });

    it('Case 8: fullFilter = "none"', () => {
        expect(interpolateFilter("none", 0.5)).toBe("none");
        expect(interpolateFilter("none", 1)).toBe("none");
        expect(interpolateFilter("none", 0)).toBe("none");
    });

    it('should return "none" if all components interpolate to identity', () => {
        const result = interpolateFilter("brightness(1) sepia(0)", 0.5);
        expect(result).toBe("none");
    });
    
    it('should handle complex mixed filter order', () => {
        const fullFilter = "sepia(0.5) brightness(1.2) hue-rotate(-20deg) blur(5px)";
        const result = interpolateFilter(fullFilter, 0.5);
        expect(result).toBe("sepia(0.25) brightness(1.1) hue-rotate(-10deg) blur(2.5px)");
    });
    
     it('should handle values very close to identity', () => {
        const result = interpolateFilter("brightness(1.0001) contrast(0.9999)", 0.5);
        expect(result).toBe("none");
    });
});
