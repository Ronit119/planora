import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const CreateEventSchema = z.object({
  title: z.string().min(2, "Event name must be at least 2 characters"),
  eventType: z.enum(["wedding", "birthday", "community", "corporate", "other"]),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  timezone: z.string().default("Asia/Kolkata"),
  guestCount: z.number().int().positive().default(100),
  budget: z.number().nonnegative().default(0),
  currency: z.string().default("INR"),
  description: z.string().default(""),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "planning", "confirmed", "completed"]).default("planning"),
  isFeatured: z.boolean().default(false),
  selectedThemeId: z.string().optional(),
});

export async function GET() {
  try {
    const events = repository.getEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = CreateEventSchema.parse(body);

    const event = repository.createEvent({
      ...validated,
      userId: repository.getProfile().id,
      coverImage: validated.coverImage || "/images/hero-mandap-crop.jpg",
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
