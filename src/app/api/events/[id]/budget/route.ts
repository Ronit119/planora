import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  allocatedAmount: z.number().nonnegative(),
  color: z.string().default("#28523D"),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categories = repository.getBudgetCategories(id);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = CategorySchema.parse(body);

    const category = repository.createBudgetCategory({
      eventId: id,
      ...validated,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, ...updates } = body;
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "categoryId required" }, { status: 400 });
    }
    const updated = repository.updateBudgetCategory(categoryId, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "categoryId query required" }, { status: 400 });
    }
    const deleted = repository.deleteBudgetCategory(categoryId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
