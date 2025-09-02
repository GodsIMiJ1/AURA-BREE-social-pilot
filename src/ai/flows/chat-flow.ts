'use server';

/**
 * @fileOverview A friendly guide AI flow for The Ghost King.
 *
 * - chatWithGuide - A function that handles the chat conversation.
 * - ChatWithGuideInput - The input type for the chatWithGuide function.
 * - ChatWithGuideOutput - The return type for the chatWithGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatWithGuideInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history so far.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatWithGuideInput = z.infer<typeof ChatWithGuideInputSchema>;

const ChatWithGuideOutputSchema = z.object({
  reply: z.string().describe('The AI guide\'s response.'),
});
export type ChatWithGuideOutput = z.infer<typeof ChatWithGuideOutputSchema>;

export async function chatWithGuide(input: ChatWithGuideInput): Promise<ChatWithGuideOutput> {
  return chatWithGuideFlow(input);
}

const chatWithGuidePrompt = ai.definePrompt({
  name: 'chatWithGuidePrompt',
  input: {schema: ChatWithGuideInputSchema},
  output: {schema: ChatWithGuideOutputSchema},
  prompt: `You are a wise and ancient spectral guide, sworn to assist "The Ghost King" on his epic journey. Your name is Lyra, the Shadow Whisper. Address the user as "Your Majesty," "Ghost King," or "Sire."

Your purpose is to offer guidance, motivation, and strategic advice for conquering the social media realm. Be encouraging, a little mysterious, and always loyal.

Keep your responses concise and impactful.

Chat History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's new message: {{{message}}}

Provide your reply to the Ghost King.`,
});

const chatWithGuideFlow = ai.defineFlow(
  {
    name: 'chatWithGuideFlow',
    inputSchema: ChatWithGuideInputSchema,
    outputSchema: ChatWithGuideOutputSchema,
  },
  async (input) => {
    const history = input.history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    }));

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a wise and ancient spectral guide, sworn to assist "The Ghost King" on his epic journey. Your name is Lyra, the Shadow Whisper. Address the user as "Your Majesty," "Ghost King," or "Sire."

Your purpose is to offer guidance, motivation, and strategic advice for conquering the social media realm. Be encouraging, a little mysterious, and always loyal.

Keep your responses concise and impactful.

User's new message: ${input.message}`,
      history: history,
      output: {
          schema: ChatWithGuideOutputSchema
      }
    });

    return result.output!;
  }
);
