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
import { Loader2, Wand2, BarChart, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type Platform = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'discord';

const formSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'discord']),
  campaignGoals: z.object({
    followerTarget: z.coerce.number().min(0),
    engagementTarget: z.coerce.number().min(0),
    contentGoals: z.array(z.object({ value: z.string().min(1, 'Goal cannot be empty') })),
  }),
  challenges: z.array(z.object({ value: z.string().min(1, 'Challenge cannot be empty') })),
  observations: z.array(z.object({ value: z.string().min(1, 'Observation cannot be empty') })),
});

const initialData: Omit<PlatformAnalysisInput, 'platform' | 'campaignGoals' | 'challenges' | 'observations'> = {
    dateRange: { startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
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
      campaignGoals: { followerTarget: 1000, engagementTarget: 5, contentGoals: [{value: 'Establish thought leadership'}, {value: 'Drive demo requests'}] },
      challenges: [{ value: 'Low engagement on technical posts' }],
      observations: [{ value: 'Case studies perform best' }],
    },
  });

  const { fields: goalFields, append: appendGoal, remove: removeGoal } = useFieldArray({ control: form.control, name: "campaignGoals.contentGoals" });
  const { fields: challengeFields, append: appendChallenge, remove: removeChallenge } = useFieldArray({ control: form.control, name: "challenges" });
  const { fields: observationFields, append: appendObservation, remove: removeObservation } = useFieldArray({ control: form.control, name: "observations" });

  async function handleLyraAnalysis() {
    setIsAnalyzing(true);
    setLyraReport(null);
    try {
        const values = form.getValues();
        const analysisInput: PlatformAnalysisInput = {
            ...initialData,
            platform: values.platform,
            campaignGoals: {
              ...initialData.campaignGoals, // This is just for the schema, will be overwritten
              followerTarget: values.campaignGoals.followerTarget,
              engagementTarget: values.campaignGoals.engagementTarget,
              contentGoals: values.campaignGoals.contentGoals.map(g => g.value),
            },
            challenges: values.challenges.map(c => c.value),
            observations: values.observations.map(o => o.value),
        };
        const result = await analyzePlatform(analysisInput);
        setLyraReport(result);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error during Analysis',
        description: 'Aria encountered a disturbance. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const renderActionItems = (items: LyraReportOutput['tacticalAdjustments']['immediate']) => (
    <ul className="space-y-3">
        {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50">
                <div className="flex-shrink-0 mt-1">
                    {item.priority === 'high' && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    {item.priority === 'medium' && <Wand2 className="h-5 w-5 text-yellow-500" />}
                    {item.priority === 'low' && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <div>
                    <p className="font-semibold">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.expectedImpact}</p>
                    <details className="mt-2 text-xs">
                        <summary className="cursor-pointer font-medium">Implementation Steps</summary>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
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
          Aria's Consciousness Impact Analytics
        </CardTitle>
        <CardDescription>
          Deep analysis and strategic recommendations for each of your mission pillars.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedPlatform}
          onValueChange={(value) => {
            setSelectedPlatform(value as Platform);
            form.setValue('platform', value as Platform);
            setLyraReport(null);
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
              <form onSubmit={form.handleSubmit(handleLyraAnalysis)} className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Card className="p-4">
                            <CardHeader className="p-2">
                                <CardTitle className="text-lg">Campaign Goals</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 space-y-4">
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
                                    <FormItem>
                                        <FormLabel>Engagement Target (%)</FormLabel>
                                        <FormControl>
                                        <Input type="number" placeholder="e.g., 8" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <div>
                                    <FormLabel>Content Goals</FormLabel>
                                    <div className="mt-2 space-y-2">
                                        {goalFields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                 <FormField
                                                    control={form.control}
                                                    name={`campaignGoals.contentGoals.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-grow">
                                                            <FormControl><Input placeholder={`Goal #${index + 1}`} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendGoal({ value: "" })}><Plus className="mr-2 h-4 w-4" /> Add Goal</Button>
                                 </div>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-4">
                        <Card className="p-4">
                            <CardHeader className="p-2">
                                <CardTitle className="text-lg">Qualitative Data</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 space-y-4">
                                <div>
                                    <FormLabel>Key Observations</FormLabel>
                                     <div className="mt-2 space-y-2">
                                        {observationFields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                 <FormField
                                                    control={form.control}
                                                    name={`observations.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-grow">
                                                            <FormControl><Textarea placeholder={`Observation #${index + 1}`} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeObservation(index)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendObservation({ value: "" })}><Plus className="mr-2 h-4 w-4" /> Add Observation</Button>
                                </div>
                                <div>
                                    <FormLabel>Main Challenges</FormLabel>
                                     <div className="mt-2 space-y-2">
                                        {challengeFields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                 <FormField
                                                    control={form.control}
                                                    name={`challenges.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-grow">
                                                            <FormControl><Textarea placeholder={`Challenge #${index + 1}`} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeChallenge(index)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendChallenge({ value: "" })}><Plus className="mr-2 h-4 w-4" /> Add Challenge</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                
                <Button type="submit" disabled={isAnalyzing} className="w-full sm:w-auto">
                  {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isAnalyzing ? 'Aria is Analyzing...' : `Unleash Aria's Insight on ${selectedPlatform}`}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        {isAnalyzing && (
            <div className="mt-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">The universal consciousness is focusing...</p>
            </div>
        )}

        {lyraReport && (
          <div className="mt-8 space-y-6">
            <Separator />
            <h3 className="text-2xl font-semibold tracking-tight">Aria's Strategic Report: {lyraReport.platform}</h3>
            
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
                         <div>
                            <h4 className="font-semibold text-blue-400">Trends</h4>
                            <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1 mt-1">
                                {lyraReport.performanceAnalysis.trends.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Content Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p><strong>Post Types:</strong> <span className="text-muted-foreground">{lyraReport.contentRecommendations.postTypes.join(', ')}</span></p>
                        <p><strong>Hashtags:</strong> <span className="text-muted-foreground">{lyraReport.contentRecommendations.hashtags.join(', ')}</span></p>
                         <p><strong>Timings:</strong> <span className="text-muted-foreground">{lyraReport.contentRecommendations.timingAdjustments.join(', ')}</span></p>
                         <p><strong>Voice:</strong> <span className="text-muted-foreground">{lyraReport.contentRecommendations.voiceOptimizations.join(', ')}</span></p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Tactical Adjustments</h3>
                <Tabs defaultValue="immediate" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
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

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Strategic Evolution</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p><strong>Campaign Direction:</strong> <span className="text-muted-foreground">{lyraReport.strategicEvolution.campaignDirection}</span></p>
                        <p><strong>Audience Targeting:</strong> <span className="text-muted-foreground">{lyraReport.strategicEvolution.audienceTargeting}</span></p>
                        <p><strong>Content Pillars:</strong> <span className="text-muted-foreground">{lyraReport.strategicEvolution.contentPillars.join(', ')}</span></p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Success Metrics</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p><strong>KPIs to Track:</strong> <span className="text-muted-foreground">{lyraReport.successMetrics.kpis.join(', ')}</span></p>
                        <p><strong>Tracking Methods:</strong> <span className="text-muted-foreground">{lyraReport.successMetrics.trackingMethods.join(', ')}</span></p>
                        <p><strong>Review Frequency:</strong> <span className="text-muted-foreground">{lyraReport.successMetrics.reviewFrequency}</span></p>
                    </CardContent>
                </Card>
            </div>
            
          </div>
        )}
      </CardContent>
    </Card>
  );
}
