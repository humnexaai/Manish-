"use client";

import { useState } from "react";
import { Palette, Settings2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";

const settingsTabs = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "billing", label: "Billing" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("general");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <Tabs tabs={settingsTabs} activeTab={tab} onChange={setTab} />

      <div className="mt-5">
        {tab === "general" ? (
          <Card className="space-y-4">
            <Input label="Display Name" defaultValue="Humnexa User" />
            <Input label="Email" defaultValue="user@example.com" readOnly />
            <Input label="Phone" defaultValue="+91 9876543210" />
            <Input label="Avatar URL" placeholder="https://..." helperText="Paste image URL for profile avatar." />
            <Select
              label="Language"
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "Hindi" },
                { value: "ta", label: "Tamil" },
              ]}
            />
            <Select
              label="Timezone"
              options={[
                { value: "asia-kolkata", label: "Asia/Kolkata" },
                { value: "utc", label: "UTC" },
              ]}
            />
            <Button>Save Changes</Button>
          </Card>
        ) : null}

        {tab === "appearance" ? (
          <Card className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Theme</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Light", "Dark", "System"].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    className="rounded-lg border border-brand-border-light bg-white p-3 text-left text-sm hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark"
                  >
                    <p className="font-medium">{theme}</p>
                    <p className="text-xs text-brand-text-secondary">Apply {theme.toLowerCase()} appearance.</p>
                  </button>
                ))}
              </div>
            </div>
            <Select
              label="Font Size"
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
            />
            <Select
              label="Code Theme"
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
            />
            <Button>Update Appearance</Button>
          </Card>
        ) : null}

        {tab === "ai" ? (
          <Card className="space-y-4">
            <Select
              label="Default AI Mode"
              options={[
                { value: "auto", label: "Auto" },
                { value: "research", label: "Research" },
                { value: "code", label: "Code" },
              ]}
            />
            <Select
              label="Default Module"
              options={[
                { value: "chat", label: "Chat" },
                { value: "learn", label: "Learn" },
                { value: "code", label: "Code" },
              ]}
            />
            <Toggle label="Memory Enabled" checked={memoryEnabled} onChange={setMemoryEnabled} />
            <Toggle label="Web Search Enabled" checked={webSearchEnabled} onChange={setWebSearchEnabled} />
            <Textarea label="Custom Instructions" placeholder="Tell Humnexa how to answer for you..." minRows={3} maxRows={8} />
            <Button>Save AI Preferences</Button>
          </Card>
        ) : null}

        {!["general", "appearance", "ai"].includes(tab) ? (
          <Card className="flex items-center justify-between">
            <p className="text-sm text-brand-text-secondary">This settings section is currently under development.</p>
            <Badge text="Coming Soon" variant="warning" />
          </Card>
        ) : null}
      </div>
    </div>
  );
}
