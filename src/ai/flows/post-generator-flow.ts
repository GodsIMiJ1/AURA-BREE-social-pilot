'use server';

/**
 * @fileOverview A Genkit flow for generating social media posts.
 *
 * - generatePost - Generates a post based on a topic and platform.
 * - GeneratePostInput - The input type for the generatePost function.
 * - GeneratePostOutput - The return type for the generatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
  platform: z.string().describe('The social media platform (e.g., Twitter, LinkedIn).'),
});
export type GeneratePostInput = z.infer<typeof GeneratePostInputSchema>;

const GeneratePostOutputSchema = z.object({
  post: z.string().describe('The generated social media post content.'),
  hashtags: z.array(z.string()).describe('A list of suggested hashtags.'),
});
export type GeneratePostOutput = z.infer<typeof GeneratePostOutputSchema>;

export async function generatePost(input: GeneratePostInput): Promise<GeneratePostOutput> {
  return generatePostFlow(input);
}

const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: {schema: GeneratePostInputSchema},
  output: {schema: GeneratePostOutputSchema},
  prompt: `You are a master social media strategist for "The Ghost King". Your tone is dark, regal, and mysterious.

Generate a social media post for the platform: {{{platform}}}.
The post must be on the topic: {{{topic}}}.

Create compelling content that aligns with The Ghost King's persona.
Suggest a list of powerful hashtags to accompany the post. Ensure they are relevant and trending if possible.
`,
});

const generatePostFlow = ai.defineFlow(
  {
    name: 'generatePostFlow',
    inputSchema: GeneratePostInputSchema,
    outputSchema: GeneratePostOutputSchema,
  },
  async (input) => {
    const {output} = await generatePostPrompt(input);
    return output!;
  }
);
