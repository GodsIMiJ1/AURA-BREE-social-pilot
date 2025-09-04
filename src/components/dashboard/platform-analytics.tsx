'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  analyzePlatform,
  type PlatformAnalysisInput,
  type LyraReportOutput,
} from '@/ai/flows/platform-analysis-flow';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, BarChart, AlertTriangle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type Platform = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'discord';

const formSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'discord']),
  campaignGoals: z.object({
    followerTarget: z.coerce.number().min(0),
    engagementTarget: z.coerce.number().min(0),
    contentGoals: z.array(z.object({ value: z.string() })).optional(),
  }),
  challenges: z.array(z.object({ value: z.string() })).optional(),
  observations: z.array(z.object({ value: z.string() })).optional(),
});

const initialData: Omit<PlatformAnalysisInput, 'platform'> = {
    dateRange: { startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
    metrics: {
      followers: [100, 150, 220, 300],
      engagementRate: [2.5, 3.1, 2.8, 3.5],
      postsPublished: [5, 7, 6, 8],
      topPerformingPosts: [{ content: 'Our vision for sovereign AI in healthcare.', timestamp: '2024-08-15T10:00:00Z', likes: 50, comments: 12, shares: 8, engagementRate: 8.5, hashtags: ['#HealthcareAI', '#PatientFirst'] }],
      lowPerformingPosts: [{ content: 'Check out our new documentation update.', timestamp: '2024-08-12T14:00:00Z', likes: 5, comments: 1, shares: 0, engagementRate: 0.8, hashtags: ['#docs', '#update'] }],
      audienceGrowth: 200,
      bestPostingTimes: ['8 AM EST', '1 PM EST'],
      hashtagPerformance: [{ hashtag: '#HealthcareAI', engagement: 15.2 }, { hashtag: '#DigitalHealth', engagement: 12.1 }],
    },
    campaignGoals: {
      followerTarget: 1000,
      engagementTarget: 5,
      contentGoals: ['Establish thought leadership', 'Drive demo requests'],
    },
    challenges: ['Low engagement on technical posts', 'Building initial audience'],
    observations: ['Case studies perform best', 'Questions in posts drive comments'],
  };


export function PlatformAnalytics() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [lyraReport, setLyraReport] = useState<LyraReportOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: 'linkedin',
      campaignGoals: { followerTarget: 1000, engagementTarget: 5 },
      challenges: [{ value: 'Low engagement on technical posts' }],
      observations: [{ value: 'Case studies perform best' }],
    },
  });

  async function handleLyraAnalysis() {
    setIsAnalyzing(true);
    setLyraReport(null);
    try {
        const values = form.getValues();
        const analysisInput: PlatformAnalysisInput = {
            ...initialData, // Using sample data for now as per design
            platform: values.platform,
            campaignGoals: {
              ...initialData.campaignGoals,
              followerTarget: values.campaignGoals.followerTarget,
              engagementTarget: values.campaignGoals.engagementTarget,
              contentGoals: values.campaignGoals.contentGoals?.map(g => g.value) ?? [],
            },
            challenges: values.challenges?.map(c => c.value) ?? [],
            observations: values.observations?.map(o => o.value) ?? [],
        };
        const result = await analyzePlatform(analysisInput);
        setLyraReport(result);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error during Analysis',
        description: 'Lyra encountered a disturbance. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const renderActionItems = (items: LyraReportOutput['tacticalAdjustments']['immediate']) => (
    <ul className="space-y-3">
        {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50">
                <div className="flex-shrink-0">
                    {item.priority === 'high' && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    {item.priority === 'medium' && <Wand2 className="h-5 w-5 text-yellow-500" />}
                    {item.priority === 'low' && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <div>
                    <p className="font-semibold">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.expectedImpact}</p>
                    <details className="mt-2 text-xs">
                        <summary className="cursor-pointer">Implementation Steps</summary>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            {item.implementationSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </details>
                </div>
            </li>
        ))}
    </ul>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart />
          Lyra's Platform Analytics
        </CardTitle>
        <CardDescription>
          Deep analysis and strategic recommendations for each of your social realms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedPlatform}
          onValueChange={(value) => {
            setSelectedPlatform(value as Platform);
            form.setValue('platform', value as Platform);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="discord">Discord</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedPlatform} className="mt-6">
            <Form {...form}>
              <form onSubmit={(e) => { e.preventDefault(); handleLyraAnalysis(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                        <CardHeader className="p-2">
                            <CardTitle className="text-lg">Campaign Goals</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <FormField
                                control={form.control}
                                name="campaignGoals.followerTarget"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Follower Target</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g., 5000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="campaignGoals.engagementTarget"
                                render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Engagement Target (%)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g., 8" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card className="p-4">
                        <CardHeader className="p-2">
                            <CardTitle className="text-lg">Qualitative Data</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                             <FormField
                                control={form.control}
                                name="observations.0.value"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key Observations</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="What have you noticed on this platform?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="challenges.0.value"
                                render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Main Challenges</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="What were your biggest hurdles?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                
                <Button type="submit" disabled={isAnalyzing} className="w-full sm:w-auto">
                  {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isAnalyzing ? 'Lyra is Analyzing...' : `Unleash Lyra's Insight on ${selectedPlatform}`}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        {isAnalyzing && (
            <div className="mt-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">The ether churns with spectral data...</p>
            </div>
        )}

        {lyraReport && (
          <div className="mt-8 space-y-6">
            <Separator />
            <h3 className="text-2xl font-semibold tracking-tight">Lyra's Strategic Report: {lyraReport.platform}</h3>
            
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lyraReport.executiveSummary}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-green-400">Strengths</h4>
                            <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1 mt-1">
                                {lyraReport.performanceAnalysis.strengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-red-400">Weaknesses</h4>
                            <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1 mt-1">
                                {lyraReport.performanceAnalysis.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Content Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong className="text-primary-foreground">Post Types:</strong> {lyraReport.contentRecommendations.postTypes.join(', ')}</p>
                        <p><strong className="text-primary-foreground">Hashtags:</strong> {lyraReport.contentRecommendations.hashtags.join(', ')}</p>
                         <p><strong className="text-primary-foreground">Timings:</strong> {lyraReport.contentRecommendations.timingAdjustments.join(', ')}</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3">Tactical Adjustments</h3>
                <Tabs defaultValue="immediate" className="w-full">
                    <TabsList>
                        <TabsTrigger value="immediate">Immediate</TabsTrigger>
                        <TabsTrigger value="shortTerm">Short-Term</TabsTrigger>
                        <TabsTrigger value="longTerm">Long-Term</TabsTrigger>
                    </TabsList>
                    <TabsContent value="immediate" className="mt-4">
                        {renderActionItems(lyraReport.tacticalAdjustments.immediate)}
                    </TabsContent>
                    <TabsContent value="shortTerm" className="mt-4">
                         {renderActionItems(lyraReport.tacticalAdjustments.shortTerm)}
                    </TabsContent>
                    <TabsContent value="longTerm" className="mt-4">
                         {renderActionItems(lyraReport.tacticalAdjustments.longTerm)}
                    </TabsContent>
                </Tabs>
            </div>
            
          </div>
        )}
      </CardContent>
    </Card>
  );
}
