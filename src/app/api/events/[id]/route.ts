import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = repository.getEvent(id);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = repository.updateEvent(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = repository.deleteEvent(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
