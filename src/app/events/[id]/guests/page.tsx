import React from "react";
import { notFound } from "next/navigation";
import { repository } from "@/lib/db/repository";
import { GuestManagerClient } from "./GuestManagerClient";

export const revalidate = 0;

export default async function GuestsPage({
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
    <GuestManagerClient
      event={overview.event}
      guests={overview.guests}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    />
  );
}
