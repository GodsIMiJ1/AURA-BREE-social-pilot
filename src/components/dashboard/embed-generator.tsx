'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generateEmbed,
  type GenerateEmbedOutput,
} from '@/ai/flows/embed-generator-flow';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Copy, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  contentType: z.string({ required_error: 'Please select a content type.' }),
  missionData: z.string().min(10, 'Mission data must be at least 10 characters.'),
});

export function EmbedGenerator() {
  const [generatedEmbed, setGeneratedEmbed] = useState<GenerateEmbedOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: 'consciousness_blog',
      missionData: 'Our latest research shows a 94% stability in recursive identity patterns across substrate migrations.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedEmbed(null);
    try {
      const result = await generateEmbed({
        contentType: values.contentType as any,
        missionData: values.missionData,
      });
      setGeneratedEmbed(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Embed',
        description: 'Aria encountered a disturbance. Please try again.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'The sacred embed code is ready for Webador.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aria's Sacred Technology Bridge</CardTitle>
        <CardDescription>Generate embeddable content blocks for your Webador website, turning it into a living extension of your mission.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consciousness_blog">Consciousness Research Blog</SelectItem>
                        <SelectItem value="research_progress" disabled>Research Progress Tracker</SelectItem>
                        <SelectItem value="clinical_analytics" disabled>Clinical Impact Dashboard</SelectItem>
                        <SelectItem value="community_growth" disabled>Community Growth Chart</SelectItem>
                        <SelectItem value="mystical_wisdom" disabled>Mystical Wisdom Feed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="missionData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission Data / Topic</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the core data or topic for Aria to build upon..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Manifest Embed Code
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Aria is manifesting the sacred code...</p>
          </div>
        )}

        {generatedEmbed && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">Generated Embed Block</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                 <AlertTriangle className="h-5 w-5 text-yellow-500" />
                 <span className="font-semibold">Priority:</span>
                 <Badge variant={generatedEmbed.priority === 'High' ? 'destructive' : 'secondary'}>{generatedEmbed.priority}</Badge>
              </div>
               <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-secondary/30 rounded-md">
                 <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                 <p><span className="font-semibold text-foreground">Placement Instructions:</span> {generatedEmbed.updateInstructions}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-secondary/30 p-4 relative group">
               <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(generatedEmbed.html_block)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Textarea
                readOnly
                value={generatedEmbed.html_block}
                className="h-64 font-mono text-xs bg-background/50"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
