import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function POST() {
  try {
    repository.resetToDemoSeed();
    return NextResponse.json({
      success: true,
      message: "Planora demo data successfully re-seeded to initial state.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
