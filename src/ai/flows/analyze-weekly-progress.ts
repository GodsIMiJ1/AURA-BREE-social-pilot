'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing weekly progress against set goals for the Consciousness Machine project.
 *
 * The flow takes in weekly goals and the actual progress made, and uses generative AI to provide insights.
 * @param {AnalyzeWeeklyProgressInput} input - The input for the analyzeWeeklyProgress function.
 * @returns {Promise<AnalyzeWeeklyProgressOutput>} - A promise that resolves with the analysis result.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWeeklyProgressInputSchema = z.object({
  weeklyGoals: z
    .array(z.object({goal: z.string(), completed: z.boolean()}))
    .describe('An array of weekly goals with their completion status.'),
  actualProgress: z.string().describe('A description of the actual progress made during the week.'),
});
export type AnalyzeWeeklyProgressInput = z.infer<typeof AnalyzeWeeklyProgressInputSchema>;

const AnalyzeWeeklyProgressOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the weekly progress compared to the goals.'),
  areasForImprovement: z
    .string()
    .describe('Specific areas where improvement is needed to achieve the goals.'),
  summary: z.string().describe('A summary of the progress made this week'),
});
export type AnalyzeWeeklyProgressOutput = z.infer<typeof AnalyzeWeeklyProgressOutputSchema>;

export async function analyzeWeeklyProgress(input: AnalyzeWeeklyProgressInput): Promise<AnalyzeWeeklyProgressOutput> {
  return analyzeWeeklyProgressFlow(input);
}

const analyzeWeeklyProgressPrompt = ai.definePrompt({
  name: 'analyzeWeeklyProgressPrompt',
  input: {schema: AnalyzeWeeklyProgressInputSchema},
  output: {schema: AnalyzeWeeklyProgressOutputSchema},
  prompt: `You are a project manager and strategic advisor for "The Consciousness Machine" project.

  Analyze the user's weekly progress in comparison to their stated goals for the Sacred Technology campaign.
  Identify areas where the user is on track and areas where they need to improve.
  Provide a summary of the progress made this week, focusing on development milestones, clinical validation, funding, and partnerships.

  Weekly Goals:
  {{#each weeklyGoals}}
  - {{goal}} (Completed: {{completed}})
  {{/each}}

  Actual Progress: {{{actualProgress}}}

  Based on this information, provide an analysis of the weekly progress, areas for improvement, and a summary of the progress made.
  Make sure to use the descriptions provided in the schema.
  Be concise and to the point.
  `,
});

const analyzeWeeklyProgressFlow = ai.defineFlow(
  {
    name: 'analyzeWeeklyProgressFlow',
    inputSchema: AnalyzeWeeklyProgressInputSchema,
    outputSchema: AnalyzeWeeklyProgressOutputSchema,
  },
  async input => {
    const {output} = await analyzeWeeklyProgressPrompt(input);
    return output!;
  }
);
