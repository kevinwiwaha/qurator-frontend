import { AppShell } from "@/components/app-shell"
import { TimingConsole } from "@/components/timing/timing-console"

export default function TimingPage() {
  return (
    <AppShell activePage="timing">
      <div className="p-6">
        <TimingConsole />
      </div>
    </AppShell>
  )
}
