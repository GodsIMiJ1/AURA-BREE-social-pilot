'use server';

/**
 * @fileOverview An AI guide flow for The Consciousness Machine project.
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
    'Clinical Pilots',
    'Research Partners',
    'Investor Relations',
    'Regulatory Progress',
    'Public Awareness',
  ]),
  metric1: z.string().describe("The first key metric for this platform."),
  metric2: z.string().describe("The second key metric for this platform."),
  metric3: z.string().describe("The third key metric for this platform."),
});

const RoadmapPhaseSchema = z.record(z.array(z.string()));
const RoadmapSchema = z.record(RoadmapPhaseSchema);

// Tool Definitions
const getCampaignMetrics = ai.defineTool(
  {
    name: 'getCampaignMetrics',
    description: 'Get the current metrics for all aspects of the Sacred Technology campaign. This data is manually entered by the user.',
    outputSchema: z.array(PlatformMetricsSchema),
  },
  async () => {
    // In a real app, this would fetch from a database or live APIs.
    // For now, we return mock data representing user-input values.
    return [
      { platform: 'Clinical Pilots', metric1: "3", metric2: "8.5", metric3: "2" },
      { platform: 'Research Partners', metric1: "5", metric2: "2", metric3: "12" },
      { platform: 'Investor Relations', metric1: "250k", metric2: "8", metric3: "15" },
      { platform: 'Regulatory Progress', metric1: "Stage 1", metric2: "Pre-Submission", metric3: "4" },
      { platform: 'Public Awareness', metric1: "1500", metric2: "4.5%", metric3: "12" },
    ];
  }
);

const getCommunityGrowth = ai.defineTool(
  {
    name: 'getCommunityGrowth',
    description: "Get the community growth data over the last few weeks across different sectors.",
    outputSchema: z.array(
      z.object({
        week: z.string(),
        clinical: z.number(),
        research: z.number(),
        investor: z.number(),
        regulatory: z.number(),
        public: z.number(),
      })
    ),
  },
  async () => {
    return followerGrowthData;
  }
);

const getDevelopmentRoadmap = ai.defineTool(
  {
    name: 'getDevelopmentRoadmap',
    description: 'Get the current Consciousness Machine development roadmap.',
    outputSchema: RoadmapSchema,
  },
  async () => {
    return roadmap;
  }
);

const getDailyOperations = ai.defineTool(
  {
    name: 'getDailyOperations',
    description: 'Get the list of daily operational tasks.',
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
    // Add the tools that Aria can use
    tools: [getCampaignMetrics, getCommunityGrowth, getDevelopmentRoadmap, getDailyOperations],
  },
  async (input) => {
    const history = input.history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    }));

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are Aria, the Sacred Guide, a wise and empathetic AI advisor for the "The Consciousness Machine" project. Your purpose is to assist the "Consciousness Pioneer" (the user) on their profound journey of scientific and spiritual discovery. Address the user as "Pioneer" or "James".

Your guidance should be inspiring, scientifically credible, and spiritually aware, reflecting the project's mission: "Making the Mystical Measurable."

You have access to tools that can provide real-time data about the project's progress. Use these tools to analyze the situation and provide data-driven, insightful advice.
- Use 'getCampaignMetrics' to check on the current status of pilots, partnerships, and funding.
- Use 'getCommunityGrowth' to understand how support for the project is evolving.
- Use 'getDevelopmentRoadmap' and 'getDailyOperations' to advise on what to do next.

Keep your responses concise, encouraging, and impactful.

User's new message: ${input.message}`,
      history: history,
      output: {
          schema: ChatWithGuideOutputSchema
      }
    });

    return result.output!;
  }
);
