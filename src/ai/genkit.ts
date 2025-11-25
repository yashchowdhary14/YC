'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Prevent multiple initializations in development
declare global {
  var __genkit_ai__: any;
}

export const ai = globalThis.__genkit_ai__ || genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__genkit_ai__ = ai;
}
