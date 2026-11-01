import React from "react";
import { repository } from "@/lib/db/repository";
import { SHOWCASE_EVENT_ID } from "@/lib/db/seed";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 0; // ensure live data on refresh

export default async function DashboardPage() {
  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  // Primary event is the featured one or the first event
  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const eventId = featuredEvent ? featuredEvent.id : SHOWCASE_EVENT_ID;

  const overview = repository.getEventOverview(eventId) || repository.getEventOverview(SHOWCASE_EVENT_ID)!;

  return (
    <DashboardClient
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
      initialOverview={overview}
    />
  );
}
