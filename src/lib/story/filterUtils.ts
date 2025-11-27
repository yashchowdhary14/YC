'use client';

/**
 * Clamps a number between 0 and 1.
 * @param n The number to clamp.
 * @returns The clamped number.
 */
export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

type FilterDefinition = {
  name: 'brightness' | 'contrast' | 'saturate' | 'opacity' | 'sepia' | 'grayscale' | 'blur' | 'hue-rotate';
  regex: RegExp;
  unit: string;
  identityValue: number;
  interpolation: 'normal' | 'direct';
};

const filterDefinitions: FilterDefinition[] = [
  { name: 'brightness', regex: /brightness\((.*?)\)/, unit: '', identityValue: 1, interpolation: 'normal' },
  { name: 'contrast', regex: /contrast\((.*?)\)/, unit: '', identityValue: 1, interpolation: 'normal' },
  { name: 'saturate', regex: /saturate\((.*?)\)/, unit: '', identityValue: 1, interpolation: 'normal' },
  { name: 'opacity', regex: /opacity\((.*?)\)/, unit: '', identityValue: 1, interpolation: 'normal' },
  { name: 'sepia', regex: /sepia\((.*?)\)/, unit: '', identityValue: 0, interpolation: 'direct' },
  { name: 'grayscale', regex: /grayscale\((.*?)\)/, unit: '', identityValue: 0, interpolation: 'direct' },
  { name: 'blur', regex: /blur\((.*?)px\)/, unit: 'px', identityValue: 0, interpolation: 'direct' },
  { name: 'hue-rotate', regex: /hue-rotate\((.*?)deg\)/, unit: 'deg', identityValue: 0, interpolation: 'direct' },
];

/**
 * Interpolates a CSS filter string based on an intensity value.
 * @param fullFilter The full-strength CSS filter string.
 * @param intensity A number between 0 and 1.
 * @returns A new CSS filter string with interpolated values.
 */
export function interpolateFilter(fullFilter: string, intensity: number): string {
  const clampedIntensity = clamp01(intensity);

  if (clampedIntensity === 0 || fullFilter === 'none') {
    return 'none';
  }
  if (clampedIntensity === 1) {
    return fullFilter;
  }

  const appliedFilters: string[] = [];
  let allIdentity = true;

  // Use a regex to find all function-like parts to maintain order
  const functionRegex = /(\w+\(.*?\))/g;
  const foundFunctions = fullFilter.match(functionRegex) || [];

  for (const func of foundFunctions) {
    let handled = false;
    for (const def of filterDefinitions) {
      const match = func.match(def.regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (!isNaN(value)) {
          let interpolatedValue: number;

          if (def.interpolation === 'normal') {
            interpolatedValue = 1 + (value - 1) * clampedIntensity;
          } else { // 'direct'
            interpolatedValue = value * clampedIntensity;
          }

          // Check if the value is close enough to identity to be ignored
          if (Math.abs(interpolatedValue - def.identityValue) > 0.001) {
            allIdentity = false;
            appliedFilters.push(`${def.name}(${parseFloat(interpolatedValue.toFixed(3))}${def.unit})`);
          }
          handled = true;
          break; // Move to the next function in the string
        }
      }
    }
    if (!handled) {
        // If the function is not in our definitions, it's ignored, per requirements.
    }
  }

  if (allIdentity || appliedFilters.length === 0) {
    return 'none';
  }

  return appliedFilters.join(' ');
}
