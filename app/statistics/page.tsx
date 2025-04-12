import { AppShell } from "@/components/app-shell"
import { StatsDashboard } from "@/components/statistics/stats-dashboard"
import { StatsFilters } from "@/components/statistics/stats-filters"

export default function StatisticsPage() {
  return (
    <AppShell activePage="statistics">
      <div className="p-6">
        <StatsFilters />
        <StatsDashboard />
      </div>
    </AppShell>
  )
}
