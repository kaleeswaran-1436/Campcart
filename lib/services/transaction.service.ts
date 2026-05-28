import { prisma } from "@/lib/prisma";


export class TransactionService {
  /**
   * reserveListing
   * Transitions a LISTED/NEGOTIATING item to RESERVED.
   */
  static async reserveListing(conversationId: string, buyerId: string) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { listing: true },
    });

    if (conversation.buyerId !== buyerId) throw new Error("Unauthorized");
    if (conversation.listing.status !== "ACTIVE") throw new Error("Listing is not active");

    return await prisma.$transaction(async (tx) => {
      // 1. Create a reservation record
      const reservation = await tx.reservation.create({
        data: {
          conversationId,
          listingId: conversation.listingId,
        },
      });

      // 2. Update listing status
      await tx.listing.update({
        where: { id: conversation.listingId },
        data: { status: "RESERVED" },
      });

      // 3. Update conversation stage
      await tx.conversation.update({
        where: { id: conversationId },
        data: { conversationStage: "RESERVED", lastActivityAt: new Date() },
      });

      // 4. Send a system message
      await tx.message.create({
        data: {
          conversationId,
          senderId: "system",
          messageType: "RESERVATION",
          content: "Listing reserved. Please coordinate a meetup.",
          serverMessageId: crypto.randomUUID(),
        },
      });

      return reservation;
    });
  }

  static async confirmMeetup(
    conversationId: string,
    meetupDetails: { title: string; meetupTime: string | Date }
  ) {
    return await prisma.$transaction(async (tx) => {
      const meetup = await tx.meetupLocation.create({
        data: {
          conversationId,
          title: meetupDetails.title,
          meetupTime: new Date(meetupDetails.meetupTime),
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { conversationStage: "MEETUP_PLANNED", lastActivityAt: new Date() },
      });

      await tx.message.create({
        data: {
          conversationId,
          senderId: "system",
          messageType: "MEETUP",
          content: "Meetup confirmed.",
          serverMessageId: crypto.randomUUID(),
        },
      });

      return meetup;
    });
  }

  /**
   * confirmExchange
   * Records a party's exchange confirmation. When both buyer and seller have confirmed,
   * the transaction is completed atomically.
   */
  static async confirmExchange(transactionId: string, confirmerId: string) {
    const transaction = await prisma.listingTransaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: { exchangeConfirmation: true },
    });

    const isBuyer = transaction.buyerId === confirmerId;
    const isSeller = transaction.sellerId === confirmerId;

    if (!isBuyer && !isSeller) {
      throw new Error("Unauthorized: You are not a participant in this transaction.");
    }

    if (transaction.status !== "QR_SCANNED" && transaction.status !== "EXCHANGE_CONFIRMED") {
      throw new Error(`Cannot confirm exchange in state: ${transaction.status}. QR must be scanned first.`);
    }

    const now = new Date();

    // Upsert ExchangeConfirmation record
    const confirmation = await prisma.exchangeConfirmation.upsert({
      where: { transactionId },
      create: {
        transactionId,
        confirmedByBuyer: isBuyer ? now : null,
        confirmedBySeller: isSeller ? now : null,
      },
      update: {
        ...(isBuyer ? { confirmedByBuyer: now } : {}),
        ...(isSeller ? { confirmedBySeller: now } : {}),
      },
    });

    // Check if both have confirmed → complete the transaction
    const bothConfirmed = !!confirmation.confirmedByBuyer && !!confirmation.confirmedBySeller;

    if (bothConfirmed) {
      await TransactionService.completeTransactionById(transactionId);
    } else {
      await prisma.listingTransaction.update({
        where: { id: transactionId },
        data: { status: "EXCHANGE_CONFIRMED" },
      });
    }

    return { confirmation, completed: bothConfirmed };
  }

  /**
   * completeTransactionById
   * Finalizes the transaction by transactionId — marks listing as SOLD, conversation as COMPLETED.
   */
  static async completeTransactionById(transactionId: string) {
    const transaction = await prisma.listingTransaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: {
        listing: { include: { conversations: { select: { id: true } } } },
      },
    });

    const conversationId = transaction.listing.conversations.find(Boolean)?.id;

    return await prisma.$transaction(async (tx) => {
      await tx.listingTransaction.update({
        where: { id: transactionId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      await tx.listing.update({
        where: { id: transaction.listingId },
        data: { status: "SOLD" },
      });

      if (conversationId) {
        await tx.conversation.update({
          where: { id: conversationId },
          data: { conversationStage: "COMPLETED", lastActivityAt: new Date() },
        });

        await tx.message.create({
          data: {
            conversationId,
            senderId: "system",
            messageType: "SYSTEM",
            content: "🎉 Exchange completed! Transaction is now finalized.",
            serverMessageId: crypto.randomUUID(),
          },
        });
      }
    });
  }

  static async completeTransaction(conversationId: string) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
    });

    return await prisma.$transaction(async (tx) => {
      await tx.listingTransaction.create({
        data: {
          listingId: conversation.listingId,
          buyerId: conversation.buyerId,
          sellerId: conversation.sellerId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      await tx.listing.update({
        where: { id: conversation.listingId },
        data: { status: "SOLD" },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { conversationStage: "COMPLETED", lastActivityAt: new Date() },
      });

      await tx.message.create({
        data: {
          conversationId,
          senderId: "system",
          messageType: "SYSTEM",
          content: "Transaction completed successfully.",
          serverMessageId: crypto.randomUUID(),
        },
      });
    });
  }

  static async cancelReservation(conversationId: string) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
    });

    return await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id: conversation.listingId },
        data: { status: "ACTIVE" },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { conversationStage: "NEGOTIATING", lastActivityAt: new Date() },
      });

      await tx.message.create({
        data: {
          conversationId,
          senderId: "system",
          messageType: "SYSTEM",
          content: "Reservation cancelled. Item is back to Active.",
          serverMessageId: crypto.randomUUID(),
        },
      });
    });
  }

  static async markListingSold(listingId: string, sellerId: string) {
    const listing = await prisma.listing.findUniqueOrThrow({
      where: { id: listingId },
    });

    if (listing.sellerId !== sellerId) throw new Error("Unauthorized");

    return await prisma.listing.update({
      where: { id: listingId },
      data: { status: "SOLD" },
    });
  }
}
