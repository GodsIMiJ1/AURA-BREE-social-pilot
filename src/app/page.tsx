import { Facebook, Instagram, Linkedin, Twitter, Bot } from 'lucide-react';
import { Header } from '@/components/dashboard/header';
import { DailyTasks } from '@/components/dashboard/daily-tasks';
import { PlatformMetricsCard } from '@/components/dashboard/platform-metrics';
import { ContentCalendar } from '@/components/dashboard/content-calendar';
import { RoadmapProgress } from '@/components/dashboard/roadmap-progress';
import { GoalAnalyzer } from '@/components/dashboard/goal-analyzer';
import { MotivationTools } from '@/components/dashboard/motivation-tools';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto grid flex-1 items-start gap-8 px-4 py-8 md:grid-cols-3 lg:grid-cols-4">
        <div className="grid auto-rows-max items-start gap-8 md:col-span-2 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <PlatformMetricsCard platform="LinkedIn" Icon={Linkedin} />
            <PlatformMetricsCard platform="Twitter" Icon={Twitter} />
            <PlatformMetricsCard platform="Facebook" Icon={Facebook} />
            <PlatformMetricsCard platform="Instagram" Icon={Instagram} />
            <PlatformMetricsCard platform="Discord" Icon={Bot} />
          </div>
          <GoalAnalyzer />
        </div>
        <div className="grid auto-rows-max items-start gap-8">
          <DailyTasks />
          <RoadmapProgress />
          <MotivationTools />
          <ContentCalendar />
        </div>
      </main>
    </div>
  );
}
