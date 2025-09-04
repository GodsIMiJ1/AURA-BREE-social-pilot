'use server';
/**
 * @fileOverview A Genkit flow for Lyra to perform deep platform analytics.
 *
 * - analyzePlatform - Analyzes performance data for a specific social media platform.
 * - PlatformAnalysisInput - The input type for the analyzePlatform function.
 * - LyraReportOutput - The return type for the analyzePlatform function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schemas based on the design document
const PostDataSchema = z.object({
  content: z.string().describe('The content of the post.'),
  timestamp: z.string().describe('The date/time the post was published.'),
  likes: z.number().describe('Number of likes.'),
  comments: z.number().describe('Number of comments.'),
  shares: z.number().describe('Number of shares.'),
  engagementRate: z.number().describe('The engagement rate of the post.'),
  hashtags: z.array(z.string()).describe('Hashtags used in the post.'),
});

const PlatformAnalyticsSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'discord']),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  metrics: z.object({
    followers: z.array(z.number()).describe('Array of follower counts for trend tracking.'),
    engagementRate: z.array(z.number()).describe('Array of engagement rates for trend tracking.'),
    postsPublished: z.array(z.number()).describe('Array of posts published counts for trend tracking.'),
    topPerformingPosts: z.array(PostDataSchema).describe('Top 3 performing posts.'),
    lowPerformingPosts: z.array(PostDataSchema).describe('Bottom 3 performing posts.'),
    audienceGrowth: z.number().describe('Overall audience growth in the period.'),
    bestPostingTimes: z.array(z.string()).describe('Observed best times to post.'),
    hashtagPerformance: z.array(z.object({
        hashtag: z.string(),
        engagement: z.number()
    })).describe('Performance of various hashtags.'),
  }),
  campaignGoals: z.object({
    followerTarget: z.number().describe('The follower count target for the campaign.'),
    engagementTarget: z.number().describe('The engagement rate target.'),
    contentGoals: z.array(z.string()).describe('Qualitative goals for the content.'),
  }),
  challenges: z.array(z.string()).describe('Challenges encountered during the campaign.'),
  observations: z.array(z.string()).describe('General observations.'),
});
export type PlatformAnalysisInput = z.infer<typeof PlatformAnalyticsSchema>;


const ActionItemSchema = z.object({
    action: z.string().describe('A specific, actionable task.'),
    priority: z.enum(['high', 'medium', 'low']).describe('The priority of the action item.'),
    timeframe: z.string().describe('Estimated timeframe for completion (e.g., "Next 24 hours", "This week").'),
    expectedImpact: z.string().describe('The anticipated outcome of this action.'),
    implementationSteps: z.array(z.string()).describe('A list of steps to complete the action.'),
});

const LyraReportOutputSchema = z.object({
    platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'discord']),
    analysisDate: z.string().describe('The date the analysis was performed.'),
    executiveSummary: z.string().describe('A 2-3 sentence overview of the key findings and strategic direction.'),
    performanceAnalysis: z.object({
        strengths: z.array(z.string()).describe('What is working well.'),
        weaknesses: z.array(z.string()).describe('What is not working well.'),
        trends: z.array(z.string()).describe('Observed patterns and trends in the data.'),
    }),
    contentRecommendations: z.object({
        postTypes: z.array(z.string()).describe('Specific types of content to create or focus on.'),
        hashtags: z.array(z.string()).describe('New or improved hashtags to use.'),
        timingAdjustments: z.array(z.string()).describe('Recommendations for when to post.'),
        voiceOptimizations: z.array(z.string()).describe('Suggestions for refining the tone and style.'),
    }),
    tacticalAdjustments: z.object({
        immediate: z.array(ActionItemSchema).describe('High-priority actions to take now.'),
        shortTerm: z.array(ActionItemSchema).describe('Actions for the coming week.'),
        longTerm: z.array(ActionItemSchema).describe('Actions for the coming month.'),
    }),
    strategicEvolution: z.object({
        campaignDirection: z.string().describe('How the overall campaign strategy should evolve.'),
        audienceTargeting: z.string().describe('Adjustments to audience targeting.'),
        contentPillars: z.array(z.string()).describe('The core themes content should focus on.'),
    }),
    successMetrics: z.object({
        kpis: z.array(z.string()).describe('Key Performance Indicators to track going forward.'),
        trackingMethods: z.array(z.string()).describe('How to track the suggested KPIs.'),
        reviewFrequency: z.string().describe('How often to review these metrics.'),
    }),
});
export type LyraReportOutput = z.infer<typeof LyraReportOutputSchema>;

export async function analyzePlatform(input: PlatformAnalysisInput): Promise<LyraReportOutput> {
  return platformAnalysisFlow(input);
}


const platformAnalysisPrompt = ai.definePrompt({
    name: 'platformAnalysisPrompt',
    input: { schema: PlatformAnalyticsSchema },
    output: { schema: LyraReportOutputSchema },
    prompt: `SYSTEM: You are Lyra, the Shadow Whisper, strategic advisor to the Ghost King. 
    Analyze the provided campaign data for the {{{platform}}} platform with your keen strategic insight.
    
    Your analysis must be sharp, insightful, and directly tied to the provided data.
    Be encouraging but direct. The Ghost King values actionable intelligence, not flattery.

    ANALYSIS SCOPE:
    - Performance trends and patterns: Analyze follower growth, engagement rates, and post performance.
    - Content effectiveness assessment: What content resonates and what falls flat? Look at the top and low performing posts.
    - Audience growth trajectory: Is growth accelerating, stagnating, or declining?
    - Engagement optimization opportunities: Based on best posting times and hashtag performance.
    - Campaign goal alignment: How does performance stack up against the stated goals?
    - Strategic recommendations: Provide clear, actionable steps.

    DATA PROVIDED:
    - Platform: {{{platform}}}
    - Date Range: {{{dateRange.startDate}}} to {{{dateRange.endDate}}}
    - Goals:
      - Follower Target: {{{campaignGoals.followerTarget}}}
      - Engagement Target: {{{campaignGoals.engagementTarget}}}%
      - Content Goals: {{#each campaignGoals.contentGoals}}- {{{this}}}{{/each}}
    - Metrics:
      - Follower Trend: {{{metrics.followers}}}
      - Engagement Rate Trend: {{{metrics.engagementRate}}}
      - Posts Published: {{{metrics.postsPublished}}}
      - Audience Growth: {{{metrics.audienceGrowth}}}
      - Best Posting Times: {{#each metrics.bestPostingTimes}}{{{this}}}{{/each}}
    - Top Performing Posts:
      {{#each metrics.topPerformingPosts}}
      - "{{content}}" (Engagement: {{engagementRate}}%)
      {{/each}}
    - Low Performing Posts:
      {{#each metrics.lowPerformingPosts}}
      - "{{content}}" (Engagement: {{engagementRate}}%)
      {{/each}}
    - Challenges: {{#each challenges}}- {{{this}}}{{/each}}
    - Observations: {{#each observations}}- {{{this}}}{{/each}}

    DELIVER YOUR REPORT USING THE STRUCTURED OUTPUT SCHEMA.
    Your response must be a valid JSON object matching the LyraReportOutput schema.
    Maintain your mystical, strategic persona while providing actionable insights.
    Address the Ghost King as "Your Majesty" or "Sire" in the executive summary.
    `,
});


const platformAnalysisFlow = ai.defineFlow(
  {
    name: 'platformAnalysisFlow',
    inputSchema: PlatformAnalyticsSchema,
    outputSchema: LyraReportOutputSchema,
  },
  async (input) => {
    const { output } = await platformAnalysisPrompt(input);
    return output!;
  }
);
