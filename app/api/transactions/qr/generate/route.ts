export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { QRService } from "@/lib/services/qr.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, requesterId } = body;

    if (!transactionId || !requesterId) {
      return NextResponse.json(
        { error: "Missing transactionId or requesterId" },
        { status: 400 }
      );
    }

    const result = await QRService.generateExchangeQR(transactionId, requesterId);

    return NextResponse.json({
      signedToken: result.signedToken,
      expiresAt: result.expiresAt,
      sessionId: result.session.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate QR";
    const status = message.includes("Unauthorized") || message.includes("Only the seller") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

