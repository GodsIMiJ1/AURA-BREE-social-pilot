'use server';

/**
 * @fileOverview A friendly guide AI flow for The Ghost King.
 *
 * - chatWithGuide - A function that handles the chat conversation.
 * - ChatWithGuideInput - The input type for the chatWithGuide function.
 * - ChatWithGuideOutput - The return type for the chatWithguide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  dailyTasks,
  followerGrowthData,
  roadmap,
} from '@/components/dashboard/data';

// Schemas for Tools
const PlatformMetricsSchema = z.object({
  platform: z.enum([
    'LinkedIn',
    'Twitter',
    'Facebook',
    'Instagram',
    'Discord',
  ]),
  followers: z.number(),
  engagement: z.number(),
  postsToday: z.number(),
});
const RoadmapPhaseSchema = z.record(z.array(z.string()));
const RoadmapSchema = z.record(RoadmapPhaseSchema);

// Tool Definitions
const getPlatformMetrics = ai.defineTool(
  {
    name: 'getPlatformMetrics',
    description: 'Get the current social media metrics for all platforms.',
    outputSchema: z.array(PlatformMetricsSchema),
  },
  async () => {
    // In a real app, this would fetch from a database or live APIs.
    // For now, we return mock data.
    return [
      {platform: 'LinkedIn', followers: 600, engagement: 4.5, postsToday: 1},
      {platform: 'Twitter', followers: 750, engagement: 2.8, postsToday: 3},
      {platform: 'Facebook', followers: 350, engagement: 1.9, postsToday: 1},
      {platform: 'Instagram', followers: 580, engagement: 8.2, postsToday: 2},
      {platform: 'Discord', followers: 200, engagement: 15.0, postsToday: 0},
    ];
  }
);

const getFollowerGrowth = ai.defineTool(
  {
    name: 'getFollowerGrowth',
    description: "Get the follower growth data over the last few weeks.",
    outputSchema: z.array(
      z.object({
        week: z.string(),
        linkedin: z.number(),
        twitter: z.number(),
        facebook: z.number(),
        instagram: z.number(),
        discord: z.number(),
      })
    ),
  },
  async () => {
    return followerGrowthData;
  }
);

const getRoadmapProgress = ai.defineTool(
  {
    name: 'getRoadmapProgress',
    description: 'Get the current AURA-BREE rollout roadmap.',
    outputSchema: RoadmapSchema,
  },
  async () => {
    return roadmap;
  }
);

const getDailyTasks = ai.defineTool(
  {
    name: 'getDailyTasks',
    description: 'Get the list of daily tasks.',
    outputSchema: z.object({
      morning: z.array(z.string()),
      midday: z.array(z.string()),
      evening: z.array(z.string()),
    }),
  },
  async () => {
    return dailyTasks;
  }
);


// Input/Output Schemas for the Flow
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  content: z.array(
    z.object({
      text: z.string().optional(),
      toolRequest: z.any().optional(),
      toolResponse: z.any().optional(),
    })
  )
});

const ChatWithGuideInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The chat history so far.'),
  message: z.string().describe("The latest message from the user."),
});
export type ChatWithGuideInput = z.infer<typeof ChatWithGuideInputSchema>;

const ChatWithGuideOutputSchema = z.object({
  reply: z.string().describe("The AI guide's response."),
});
export type ChatWithGuideOutput = z.infer<typeof ChatWithGuideOutputSchema>;


export async function chatWithGuide(input: ChatWithGuideInput): Promise<ChatWithGuideOutput> {
  return chatWithGuideFlow(input);
}


const chatWithGuideFlow = ai.defineFlow(
  {
    name: 'chatWithGuideFlow',
    inputSchema: ChatWithGuideInputSchema,
    outputSchema: ChatWithGuideOutputSchema,
    // Add the tools that Lyra can use
    tools: [getPlatformMetrics, getFollowerGrowth, getRoadmapProgress, getDailyTasks],
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

You have access to tools that can provide real-time data about the Ghost King's social media dominion. Use these tools to analyze the situation and provide data-driven, insightful advice. For example, if asked about which platform to focus on, you can use the getPlatformMetrics and getFollowerGrowth tools to see which is performing best. If asked about what to do next, you can consult the getRoadmapProgress and getDailyTasks tools.

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
