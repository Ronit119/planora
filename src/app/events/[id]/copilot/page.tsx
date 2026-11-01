import React from "react";
import { notFound } from "next/navigation";
import { repository } from "@/lib/db/repository";
import { CopilotWorkspaceClient } from "./CopilotWorkspaceClient";

export const revalidate = 0;

export default async function CopilotPage({
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
  const initialMessages = repository.getAIMessages(id);

  return (
    <CopilotWorkspaceClient
      event={overview.event}
      initialMessages={initialMessages}
      categories={overview.categories}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    />
  );
}
