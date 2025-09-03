import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { roadmap } from "./data";


const TaskItem = ({ task }: { task: string }) => (
    <div className="flex items-start space-x-3 py-1.5">
      <Checkbox id={task} className="mt-1" />
      <Label htmlFor={task} className="text-sm font-normal text-foreground/90 leading-snug">
        {task}
      </Label>
    </div>
  );

export function RoadmapProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AURA-BREE Rollout Roadmap</CardTitle>
        <CardDescription>Your zero-budget, maximum impact strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(roadmap).map(([phase, sections], phaseIndex) => (
            <AccordionItem value={`phase-${phaseIndex}`} key={phase}>
              <AccordionTrigger>{phase}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full space-y-2 pl-4">
                  {Object.entries(sections).map(([section, tasks], sectionIndex) => (
                    <AccordionItem value={`section-${phaseIndex}-${sectionIndex}`} key={section}>
                       <AccordionTrigger className="text-base py-3">{section}</AccordionTrigger>
                       <AccordionContent className="pt-2 pl-4 border-l">
                        {tasks.map((task) => (
                            <TaskItem key={task} task={task} />
                        ))}
                       </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
