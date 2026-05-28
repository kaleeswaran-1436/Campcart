export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { QRService } from "@/lib/services/qr.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { signedToken, scannerId } = body;

    if (!signedToken || !scannerId) {
      return NextResponse.json(
        { error: "Missing signedToken or scannerId" },
        { status: 400 }
      );
    }

    const result = await QRService.verifyExchangeQR(signedToken, scannerId);

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      sessionId: result.session.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "QR verification failed";
    const status =
      message.includes("Unauthorized") || message.includes("not the designated buyer")
        ? 403
        : message.includes("expired") || message.includes("already been scanned")
        ? 410
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

