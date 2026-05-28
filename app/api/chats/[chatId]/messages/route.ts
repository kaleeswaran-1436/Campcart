import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const body = await request.json();
    const { content, type = "TEXT", clientTempId, senderId } = body;

    if (!content || !clientTempId || !senderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify conversation exists and user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: chatId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.buyerId !== senderId && conversation.sellerId !== senderId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Determine receiver to increment unread counts
    const isBuyer = conversation.buyerId === senderId;
    const receiverId = isBuyer ? conversation.sellerId : conversation.buyerId;

    // We can use an explicit transaction or just rely on atomic updates
    const serverMessageId = crypto.randomUUID();

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          serverMessageId,
          clientTempId,
          conversationId: chatId,
          senderId,
          content,
          messageType: type,
          messageStatus: "DELIVERED",
        },
      }),
      prisma.conversation.update({
        where: { id: chatId },
        data: {
          lastActivityAt: new Date(),
          lastMessageId: serverMessageId,
        },
      }),
    ]);
    
    // In a real app we might update participant unread count specifically
    // But our prompt spec had "unreadCountBuyer" / "unreadCountSeller" which we did not explicitly add to Conversation (we used `ConversationParticipant.unreadCount` instead, or maybe we didn't add it to Conversation directly). 
    // We can increment it on ConversationParticipant:
    
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: chatId,
          userId: receiverId
        }
      },
      data: {
        unreadCount: { increment: 1 }
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    // Implement cursor pagination logic
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = 50;
    
    const messages = await prisma.message.findMany({
      where: { conversationId: chatId },
      take: limit + 1, // take 1 extra for next cursor
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });
    
    let nextCursor: string | null = null;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem!.id;
    }
    
    // Return ascending for UI
    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
