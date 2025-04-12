import { AppShell } from "@/components/app-shell"
import { LeaderboardList } from "@/components/leaderboard-list"
import { LeaderboardFilters } from "@/components/leaderboard-filters"

export default function HomePage() {
  return (
    <AppShell>
      <div className="p-6">
        <LeaderboardFilters />
        <LeaderboardList />
      </div>
    </AppShell>
  )
}
