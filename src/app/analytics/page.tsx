import { FollowerGrowthChart } from '@/components/dashboard/follower-growth-chart';
import { PlatformAnalytics } from '@/components/dashboard/platform-analytics';

export default function AnalyticsPage() {
  return (
    <div className="grid flex-1 items-start gap-8">
      <PlatformAnalytics />
      <FollowerGrowthChart />
    </div>
  );
}
