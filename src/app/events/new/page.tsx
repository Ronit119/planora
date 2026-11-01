import React from "react";
import { repository } from "@/lib/db/repository";
import { EventCreationWizard } from "./EventCreationWizard";

export const revalidate = 0;

export default async function NewEventPage() {
  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  return (
    <EventCreationWizard
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    />
  );
}
