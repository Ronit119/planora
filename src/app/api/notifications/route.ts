import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET() {
  try {
    const notifications = repository.getNotifications();
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      repository.markAllNotificationsRead();
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (id) {
      repository.markNotificationRead(id);
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ success: false, error: "Missing id or markAll parameter" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
