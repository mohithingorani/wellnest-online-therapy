import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import {
  ConversationListItemSchema,
  MessageSchema,
  SendMessageSchema,
  CreateConversationSchema,
} from "../inputs";

const ConversationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const CursorPaginationSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export async function listConversations(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    const therapistId = req.therapistId;

    if (!userId && !therapistId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const where = userId
      ? { userId }
      : { therapistId };

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        therapist: { select: { id: true, name: true, title: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const data = conversations.map((c) => ({
      id: c.id,
      userId: c.userId,
      therapistId: c.therapistId,
      therapist: c.therapist,
      lastMessage: c.messages[0] || null,
      unreadCount: 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    const parsed = z.array(ConversationListItemSchema).parse(data);
    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const parsedParams = ConversationIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id",
      });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: parsedParams.data.id },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.authUser?.id;
    const therapistId = req.therapistId;

    if (
      !(userId && conversation.userId === userId) &&
      !(therapistId && conversation.therapistId === therapistId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const parsedQuery = CursorPaginationSchema.safeParse(req.query);
    const query = parsedQuery.success ? parsedQuery.data : { limit: 50 };

    const messages = await prisma.message.findMany({
      where: { conversationId: parsedParams.data.id },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = messages.length > query.limit;
    if (hasMore) messages.pop();

    const parsed = z.array(MessageSchema).parse(messages.reverse());
    return res.json({
      success: true,
      data: {
        messages: parsed,
        nextCursor: hasMore ? messages[0]?.id : null,
        hasMore,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const parsedParams = ConversationIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id",
      });
    }

    const parsedBody = SendMessageSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: z.flattenError(parsedBody.error),
      });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: parsedParams.data.id },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.authUser?.id;
    const therapistId = req.therapistId;

    if (
      !(userId && conversation.userId === userId) &&
      !(therapistId && conversation.therapistId === therapistId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const senderType = userId ? "user" : "therapist";
    const senderId = userId || therapistId!;

    const message = await prisma.message.create({
      data: {
        content: parsedBody.data.content,
        conversationId: parsedParams.data.id,
        senderType,
        senderId,
      },
    });

    await prisma.conversation.update({
      where: { id: parsedParams.data.id },
      data: { updatedAt: new Date() },
    });

    const parsed = MessageSchema.parse(message);
    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
}

export async function createConversation(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const parsedBody = CreateConversationSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: z.flattenError(parsedBody.error),
      });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { id: parsedBody.data.therapistId },
    });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    const existing = await prisma.conversation.findUnique({
      where: {
        userId_therapistId: {
          userId,
          therapistId: parsedBody.data.therapistId,
        },
      },
      include: {
        therapist: { select: { id: true, name: true, title: true } },
      },
    });

    if (existing) {
      const parsed = ConversationListItemSchema.parse({
        ...existing,
        lastMessage: null,
        unreadCount: 0,
      });
      return res.json({ success: true, data: parsed });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        therapistId: parsedBody.data.therapistId,
      },
      include: {
        therapist: { select: { id: true, name: true, title: true } },
      },
    });

    const parsed = ConversationListItemSchema.parse({
      ...conversation,
      lastMessage: null,
      unreadCount: 0,
    });
    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
}
