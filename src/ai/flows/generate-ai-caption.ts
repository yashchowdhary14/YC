'use server';

/**
 * @fileOverview An AI agent that generates captions for user posts based on uploaded media and trending data.
 *
 * - generateAiCaption - A function that handles the caption generation process.
 * - GenerateAiCaptionInput - The input type for the generateAiCaption function.
 * - GenerateAiCaptionOutput - The return type for the generateAiCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiCaptionInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userProfile: z.object({
    username: z.string().describe('The username of the user.'),
    bio: z.string().describe('The bio of the user.'),
    followers: z.array(z.string()).describe('The list of user IDs following the user.'),
    following: z.array(z.string()).describe('The list of user IDs the user is following.'),
  }).optional().describe('The profile information of the user.'),
  trendingKeywords: z.array(z.string()).optional().describe('Trending keywords related to recent popular posts.'),
});
export type GenerateAiCaptionInput = z.infer<typeof GenerateAiCaptionInputSchema>;

const GenerateAiCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated caption for the post.'),
});
export type GenerateAiCaptionOutput = z.infer<typeof GenerateAiCaptionOutputSchema>;

export async function generateAiCaption(input: GenerateAiCaptionInput): Promise<GenerateAiCaptionOutput> {
  return generateAiCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiCaptionPrompt',
  input: {schema: GenerateAiCaptionInputSchema},
  output: {schema: GenerateAiCaptionOutputSchema},
  prompt: `You are a social media expert. Generate a catchy and engaging caption for a user's post.

Consider the following information when crafting the caption:

{{#if userProfile}}
User Profile:
  Username: {{{userProfile.username}}}
  Bio: {{{userProfile.bio}}}
{{/if}}

{{#if trendingKeywords}}
Trending Keywords:
  {{#each trendingKeywords}}
  - {{{this}}}
  {{/each}}
{{/if}}

Description of the Media: Based on the image, extract people, objects or locations, but do not include in the caption directly. If the user has followers or followees, use them to generate context for the trending post.
Media: {{media url=mediaDataUri}}

Caption:`, 
});

const generateAiCaptionFlow = ai.defineFlow(
  {
    name: 'generateAiCaptionFlow',
    inputSchema: GenerateAiCaptionInputSchema,
    outputSchema: GenerateAiCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
