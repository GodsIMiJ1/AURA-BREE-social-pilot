'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generatePost,
  type GeneratePostOutput,
} from '@/ai/flows/post-generator-flow';

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
import { Loader2, Wand2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters.'),
  platform: z.string({
    required_error: 'Please select a platform.',
  }),
});

export function PostGenerator() {
  const [generatedPost, setGeneratedPost] = useState<GeneratePostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPost(null);
    try {
      const result = await generatePost(values);
      setGeneratedPost(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Post',
        description: 'The creative energies are weak. Please try again.',
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
      description: 'The sacred content is ready for dissemination.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sacred Content Creator</CardTitle>
        <CardDescription>Generate profound content for your campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Topic of Revelation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The empirical validation of mystical concepts..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Create Content
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Generating profound insights...</p>
          </div>
        )}

        {generatedPost && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <div className="space-y-4 rounded-lg border bg-secondary/30 p-4 relative group">
               <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(`${generatedPost.post}\n\n${generatedPost.hashtags.join(' ')}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <div>
                <Textarea
                  readOnly
                  value={generatedPost.post}
                  className="h-32 text-base"
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suggested Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
