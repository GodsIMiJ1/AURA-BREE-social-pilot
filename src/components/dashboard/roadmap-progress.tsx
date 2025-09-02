import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

const phases = [
  { name: "Phase 1: Foundation Setup", progress: 80, weeks: "1-2" },
  { name: "Phase 2: Content Development", progress: 45, weeks: "3-4" },
  { name: "Phase 3: Community Building", progress: 20, weeks: "5-8" },
  { name: "Phase 4: Engagement Optimization", progress: 0, weeks: "9-12" },
  { name: "Phase 5: Growth Acceleration", progress: 0, weeks: "4+" },
];

export function RoadmapProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roadmap Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-0">
          {phases.map((phase, index) => (
            <AccordionItem value={`item-${index}`} key={phase.name}>
              <AccordionTrigger>{phase.name}</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-muted-foreground">Overall Progress (Weeks {phase.weeks})</Label>
                    <span className="text-sm font-medium">{phase.progress}%</span>
                </div>
                <Progress value={phase.progress} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
