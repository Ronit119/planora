import React from "react";
import { repository } from "@/lib/db/repository";
import { SettingsClient } from "./SettingsClient";

export const revalidate = 0;

export default async function SettingsPage() {
  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
  const geminiConfigured = !!process.env.GEMINI_API_KEY;

  return (
    <SettingsClient
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
      supabaseConfigured={supabaseConfigured}
      geminiConfigured={geminiConfigured}
    />
  );
}
