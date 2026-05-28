import { NextResponse } from "next/server";
import { TransactionService } from "@/lib/services/transaction.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, confirmerId } = body;

    if (!transactionId || !confirmerId) {
      return NextResponse.json(
        { error: "Missing transactionId or confirmerId" },
        { status: 400 }
      );
    }

    const result = await TransactionService.confirmExchange(transactionId, confirmerId);

    return NextResponse.json({
      success: true,
      completed: result.completed,
      confirmation: {
        confirmedByBuyer: result.confirmation.confirmedByBuyer,
        confirmedBySeller: result.confirmation.confirmedBySeller,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Exchange confirmation failed";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
