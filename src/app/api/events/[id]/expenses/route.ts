import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const ExpenseSchema = z.object({
  title: z.string().min(1, "Expense title is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  categoryId: z.string().default(""),
  categoryName: z.string().optional(),
  paymentStatus: z.enum(["pending", "partially_paid", "paid"]).default("paid"),
  paymentDate: z.string().optional(),
  vendorId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const expenses = repository.getExpenses(id);
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = ExpenseSchema.parse(body);

    const expense = repository.createExpense({
      eventId: id,
      ...validated,
      paymentDate: validated.paymentDate || new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { expenseId, ...updates } = body;
    if (!expenseId) {
      return NextResponse.json({ success: false, error: "expenseId required" }, { status: 400 });
    }
    const updated = repository.updateExpense(expenseId, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const expenseId = searchParams.get("expenseId");
    if (!expenseId) {
      return NextResponse.json({ success: false, error: "expenseId query required" }, { status: 400 });
    }
    const deleted = repository.deleteExpense(expenseId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
