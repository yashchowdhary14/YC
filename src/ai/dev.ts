import { config } from 'dotenv';
config();

import { defineDevApp } from '@genkit-ai/next';

// This will be run only once per server start
defineDevApp(async () => {
  await import('@/ai/flows/generate-ai-caption.ts');
});
