import React from "react";
import { notFound } from "next/navigation";
import { repository } from "@/lib/db/repository";
import { TimelineClient } from "./TimelineClient";

export const revalidate = 0;

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const overview = repository.getEventOverview(id);
  if (!overview) {
    notFound();
  }

  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  return (
    <TimelineClient
      event={overview.event}
      tasks={overview.tasks}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    />
  );
}
