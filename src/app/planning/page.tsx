import { ContentCalendar } from '@/components/dashboard/content-calendar';
import { DailyTasks } from '@/components/dashboard/daily-tasks';
import { GoalAnalyzer } from '@/components/dashboard/goal-analyzer';
import { RoadmapProgress } from '@/components/dashboard/roadmap-progress';

export default function PlanningPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="grid auto-rows-max items-start gap-8">
        <GoalAnalyzer />
        <DailyTasks />
      </div>
      <div className="grid auto-rows-max items-start gap-8">
        <RoadmapProgress />
        <ContentCalendar />
      </div>
    </div>
  );
}
