import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const morningTasks = [
  "Check LinkedIn mentions and messages",
  "Respond to comments on yesterday's posts",
  "Schedule today's main LinkedIn post",
  "Check Twitter notifications",
  "Post daily insight on Twitter",
];

const middayTasks = [
  "Engage with 10 accounts on Instagram",
  "Post a Facebook story",
  "Check Discord community for questions",
];

const eveningTasks = [
  "Review daily metrics",
  "Plan tomorrow's content",
  "Engage with LinkedIn comments",
];

const TaskItem = ({ task }: { task: string }) => (
  <div className="flex items-center space-x-3 py-2">
    <Checkbox id={task} />
    <Label htmlFor={task} className="text-sm font-normal text-foreground/90">
      {task}
    </Label>
  </div>
);

export function DailyTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Task Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="morning">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="morning">Morning</TabsTrigger>
            <TabsTrigger value="midday">Midday</TabsTrigger>
            <TabsTrigger value="evening">Evening</TabsTrigger>
          </TabsList>
          <TabsContent value="morning" className="mt-4">
            <div className="space-y-2">
              {morningTasks.map((task) => (
                <TaskItem key={task} task={task} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="midday" className="mt-4">
            <div className="space-y-2">
              {middayTasks.map((task) => (
                <TaskItem key={task} task={task} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="evening" className="mt-4">
            <div className="space-y-2">
              {eveningTasks.map((task) => (
                <TaskItem key={task} task={task} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="time-logged">Time Logged (minutes)</Label>
            <Input id="time-logged" type="number" placeholder="e.g., 30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Add any notes for this session..." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
