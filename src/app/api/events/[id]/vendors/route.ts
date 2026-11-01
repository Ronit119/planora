import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const VendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  category: z.enum([
    "Venue",
    "Catering",
    "Decor",
    "Photography",
    "Entertainment",
    "Attire",
    "Logistics",
    "Stationery",
    "Other",
  ]),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  quotedAmount: z.number().nonnegative().default(0),
  contractAmount: z.number().nonnegative().default(0),
  advancePaid: z.number().nonnegative().default(0),
  status: z.enum([
    "Researching",
    "Shortlisted",
    "Contacted",
    "Negotiating",
    "Booked",
    "Completed",
    "Cancelled",
  ]).default("Shortlisted"),
  image: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vendors = repository.getVendors(id);
    return NextResponse.json({ success: true, data: vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = VendorSchema.parse(body);

    const vendor = repository.createVendor({
      eventId: id,
      ...validated,
      image: validated.image || "/images/vendor-royal-courtyard-crop.jpg",
    });

    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { vendorId, ...updates } = body;
    if (!vendorId) {
      return NextResponse.json({ success: false, error: "vendorId required" }, { status: 400 });
    }
    const updated = repository.updateVendor(vendorId, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    if (!vendorId) {
      return NextResponse.json({ success: false, error: "vendorId query required" }, { status: 400 });
    }
    const deleted = repository.deleteVendor(vendorId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
