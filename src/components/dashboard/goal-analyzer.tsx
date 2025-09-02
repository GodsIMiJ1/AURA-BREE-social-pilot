"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  analyzeWeeklyProgress,
  type AnalyzeWeeklyProgressInput,
  type AnalyzeWeeklyProgressOutput,
} from "@/ai/flows/analyze-weekly-progress";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  weeklyGoals: z.array(z.object({ goal: z.string().min(1, "Goal cannot be empty"), completed: z.boolean() })),
  actualProgress: z.string().min(10, "Please provide more details on your progress."),
});

export function GoalAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWeeklyProgressOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weeklyGoals: [{ goal: "", completed: false }],
      actualProgress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "weeklyGoals",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeWeeklyProgress(values as AnalyzeWeeklyProgressInput);
      setAnalysisResult(result);
    } catch (e) {
      setError("Failed to get analysis. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goal Analysis</CardTitle>
        <CardDescription>Get AI-powered insights on your weekly performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel>Weekly Goals</FormLabel>
              <div className="mt-2 space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`weeklyGoals.${index}.completed`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`weeklyGoals.${index}.goal`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder={`Goal #${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ goal: "", completed: false })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Goal
                </Button>
            </div>

            <FormField
              control={form.control}
              name="actualProgress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Progress Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what you accomplished this week, any challenges, and key interactions..." {...field} />
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
              Analyze Progress
            </Button>
          </form>
        </Form>
        
        {isLoading && (
            <div className="mt-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Analyzing your week...</p>
            </div>
        )}

        {error && (
            <div className="mt-6 rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
            </div>
        )}

        {analysisResult && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">AI Analysis</h3>
            <div className="space-y-4 rounded-lg border bg-secondary/30 p-4">
              <div>
                <h4 className="font-semibold">Summary</h4>
                <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold">Analysis</h4>
                <p className="text-sm text-muted-foreground">{analysisResult.analysis}</p>
              </div>
              <div>
                <h4 className="font-semibold">Areas for Improvement</h4>
                <p className="text-sm text-muted-foreground">{analysisResult.areasForImprovement}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
