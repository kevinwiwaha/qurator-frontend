import { AppShell } from "@/components/app-shell"
import { EventsList } from "@/components/events/events-list"
import { EventsFilters } from "@/components/events/events-filters"

export default function EventsPage() {
  return (
    <AppShell activePage="events">
      <div className="p-6">
        <EventsFilters />
        <EventsList />
      </div>
    </AppShell>
  )
}
