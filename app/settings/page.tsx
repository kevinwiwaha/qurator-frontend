import { AppShell } from "@/components/app-shell"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <AppShell activePage="settings">
      <div className="p-6">
        <SettingsContent />
      </div>
    </AppShell>
  )
}
