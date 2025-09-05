import { ChatGuide } from '@/components/dashboard/chat-guide';
import { MotivationTools } from '@/components/dashboard/motivation-tools';
import { PlatformMetricsCard } from '@/components/dashboard/platform-metrics';


export default function DashboardPage() {
  return (
    <div className="grid flex-1 items-start gap-8 md:grid-cols-3 lg:grid-cols-4">
      <div className="grid auto-rows-max items-start gap-8 md:col-span-2 lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <PlatformMetricsCard platform="Clinical Pilots" iconName="HeartPulse" />
          <PlatformMetricsCard platform="Research Partners" iconName="Library" />
          <PlatformMetricsCard platform="Investor Relations" iconName="Landmark" />
          <PlatformMetricsCard platform="Regulatory Progress" iconName="FileCheck" />
          <PlatformMetricsCard platform="Public Awareness" iconName="Users" />
        </div>
        <MotivationTools />
      </div>
      <div className="grid auto-rows-max items-start gap-8 lg:sticky lg:top-24">
        <ChatGuide />
      </div>
    </div>
  );
}
