import { AppShell } from "@/components/app-shell"
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar"
import { ScheduleFilters } from "@/components/schedule/schedule-filters"

export default function SchedulePage() {
  return (
    <AppShell activePage="schedule">
      <div className="p-6">
        <ScheduleFilters />
        <ScheduleCalendar />
      </div>
    </AppShell>
  )
}
