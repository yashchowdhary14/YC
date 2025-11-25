'use server';

import { generateAiCaption } from '@/ai/flows/generate-ai-caption';

export async function handleCaptionGeneration(mediaDataUri: string) {
  try {
    // In a real application, you would get user data and trending topics from your database.
    const result = await generateAiCaption({
      mediaDataUri,
      userProfile: {
        username: 'ycombinator_user',
        bio: 'Exploring the world of startups and technology. Passionate about innovation and building the future.',
        followers: ['user1', 'user2', 'user3'],
        following: ['user4', 'user5'],
      },
      trendingKeywords: ['techlife', 'innovation', 'futureoftech', 'startups', 'coding'],
    });
    return { caption: result.caption, error: null };
  } catch (e) {
    console.error(e);
    // Return a user-friendly error message.
    return { caption: null, error: 'Failed to generate caption. The AI model might be temporarily unavailable. Please try again later.' };
  }
}
