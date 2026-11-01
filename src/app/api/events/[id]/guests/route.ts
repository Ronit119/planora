import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const GuestSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  groupTag: z.enum(["family", "vip", "friends", "colleagues", "other"]).default("friends"),
  rsvpStatus: z.enum(["attending", "declined", "invited", "awaiting"]).default("awaiting"),
  dietaryPreference: z
    .enum(["none", "vegetarian", "vegan", "jain", "halal", "gluten_free", "nut_allergy", "other"])
    .default("none"),
  plusOneCount: z.number().int().nonnegative().default(0),
  tableNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guests = repository.getGuests(id);
    return NextResponse.json({ success: true, data: guests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Support both single guest creation and batch CSV import array
    if (Array.isArray(body)) {
      const createdGuests = body.map((g) => {
        const validated = GuestSchema.parse(g);
        return repository.createGuest({
          eventId: id,
          ...validated,
        });
      });
      return NextResponse.json({ success: true, data: createdGuests }, { status: 201 });
    }

    const validated = GuestSchema.parse(body);
    const guest = repository.createGuest({
      eventId: id,
      ...validated,
    });

    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { guestId, ...updates } = body;
    if (!guestId) {
      return NextResponse.json({ success: false, error: "guestId required" }, { status: 400 });
    }
    const updated = repository.updateGuest(guestId, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId");
    if (!guestId) {
      return NextResponse.json({ success: false, error: "guestId query required" }, { status: 400 });
    }
    const deleted = repository.deleteGuest(guestId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
