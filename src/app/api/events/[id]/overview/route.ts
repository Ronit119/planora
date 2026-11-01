import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const overview = repository.getEventOverview(id);
    if (!overview) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: overview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
