import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.QR_JWT_SECRET ?? "campcart-qr-dev-secret-change-in-production"
);

const QR_EXPIRY_MINUTES = 5;

export interface QRPayload {
  nonce: string;
  transactionId: string;
  sellerId: string;
  buyerId: string;
  listingId: string;
  expiresAt: string;
}

export class QRService {
  /**
   * generateExchangeQR
   * Validates that the transaction is in MEETUP_PENDING state (or MEETUP_PLANNED conv stage),
   * then creates a short-lived JWT and records a QRVerificationSession.
   */
  static async generateExchangeQR(transactionId: string, requesterId: string) {
    const transaction = await prisma.listingTransaction.findUniqueOrThrow({
      where: { id: transactionId },
    });

    // Only seller can generate QR (they hand the item over)
    if (transaction.sellerId !== requesterId) {
      throw new Error("Only the seller can generate the exchange QR code.");
    }

    if (
      transaction.status !== "MEETUP_PENDING" &&
      transaction.status !== "PENDING"
    ) {
      throw new Error(
        `Cannot generate QR for transaction in state: ${transaction.status}`
      );
    }

    // Expire any previous ACTIVE sessions first
    await prisma.qRVerificationSession.updateMany({
      where: {
        transactionId,
        status: "ACTIVE",
      },
      data: { status: "CANCELLED" },
    });

    const nonce = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000);

    const payload: QRPayload = {
      nonce,
      transactionId,
      sellerId: transaction.sellerId,
      buyerId: transaction.buyerId,
      listingId: transaction.listingId,
      expiresAt: expiresAt.toISOString(),
    };

    const signedToken = await new SignJWT(payload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${QR_EXPIRY_MINUTES}m`)
      .setIssuedAt()
      .sign(JWT_SECRET);

    // Record session + advance transaction state
    const [session] = await prisma.$transaction([
      prisma.qRVerificationSession.create({
        data: {
          transactionId,
          sellerId: transaction.sellerId,
          buyerId: transaction.buyerId,
          nonce,
          signedToken,
          expiresAt,
          status: "ACTIVE",
        },
      }),
      prisma.listingTransaction.update({
        where: { id: transactionId },
        data: { status: "QR_GENERATED" },
      }),
    ]);

    return { session, signedToken, expiresAt };
  }

  /**
   * verifyExchangeQR
   * Validates the scanned JWT token and advances the session to SCANNED.
   */
  static async verifyExchangeQR(signedToken: string, scannerId: string) {
    let payload: QRPayload;

    try {
      const { payload: decoded } = await jwtVerify(signedToken, JWT_SECRET);
      payload = decoded as unknown as QRPayload;
    } catch {
      throw new Error("QR code is invalid or has expired. Please ask the seller to generate a new one.");
    }

    // Ensure scanner is the buyer (only buyer scans the seller's QR)
    if (payload.buyerId !== scannerId) {
      throw new Error("You are not the designated buyer for this transaction.");
    }

    const session = await prisma.qRVerificationSession.findUnique({
      where: { nonce: payload.nonce },
    });

    if (!session) throw new Error("QR session not found.");
    if (session.status === "SCANNED") throw new Error("QR code has already been scanned.");
    if (session.status !== "ACTIVE") throw new Error("QR session is no longer active.");
    if (new Date() > session.expiresAt) {
      await prisma.qRVerificationSession.update({
        where: { id: session.id },
        data: { status: "EXPIRED" },
      });
      throw new Error("QR code has expired. Please ask the seller to regenerate.");
    }

    const [updatedSession] = await prisma.$transaction([
      prisma.qRVerificationSession.update({
        where: { id: session.id },
        data: { status: "SCANNED", scannedAt: new Date() },
      }),
      prisma.listingTransaction.update({
        where: { id: payload.transactionId },
        data: { status: "QR_SCANNED" },
      }),
    ]);

    return { session: updatedSession, transactionId: payload.transactionId };
  }
}
