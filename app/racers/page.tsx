import { AppShell } from "@/components/app-shell"
import { RacersList } from "@/components/racers/racers-list"
import { RacersFilters } from "@/components/racers/racers-filters"

export default function RacersPage() {
  return (
    <AppShell activePage="racers">
      <div className="p-6">
        <RacersFilters />
        <RacersList />
      </div>
    </AppShell>
  )
}
