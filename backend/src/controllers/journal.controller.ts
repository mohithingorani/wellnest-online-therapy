import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import {
  JournalEntrySchema,
  CreateJournalEntrySchema,
  UpdateJournalEntrySchema,
  JournalEntryListQuerySchema,
} from "../inputs";

const EntryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function listEntries(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedQuery = JournalEntryListQuerySchema.safeParse(req.query);
    const query = parsedQuery.success ? parsedQuery.data : { limit: 50 };

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = entries.length > query.limit;
    if (hasMore) entries.pop();

    const parsed = z.array(JournalEntrySchema).parse(entries);
    return res.json({
      success: true,
      data: {
        entries: parsed,
        nextCursor: hasMore ? entries[entries.length - 1]?.id ?? null : null,
        hasMore,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch journal entries",
    });
  }
}

export async function getEntry(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedParams = EntryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id",
      });
    }

    const entry = await prisma.journalEntry.findUnique({
      where: { id: parsedParams.data.id },
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const parsed = JournalEntrySchema.parse(entry);
    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch journal entry",
    });
  }
}

export async function createEntry(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedBody = CreateJournalEntrySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: z.flattenError(parsedBody.error),
      });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: parsedBody.data.title,
        content: parsedBody.data.content,
        mood: parsedBody.data.mood ?? null,
      },
    });

    const parsed = JournalEntrySchema.parse(entry);
    return res.status(201).json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create journal entry",
    });
  }
}

export async function updateEntry(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedParams = EntryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id",
      });
    }

    const existing = await prisma.journalEntry.findUnique({
      where: { id: parsedParams.data.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const parsedBody = UpdateJournalEntrySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: z.flattenError(parsedBody.error),
      });
    }

    const data: Record<string, unknown> = {};
    if (parsedBody.data.title !== undefined) data.title = parsedBody.data.title;
    if (parsedBody.data.content !== undefined) data.content = parsedBody.data.content;
    if (parsedBody.data.mood !== undefined) data.mood = parsedBody.data.mood;

    const entry = await prisma.journalEntry.update({
      where: { id: parsedParams.data.id },
      data,
    });

    const parsed = JournalEntrySchema.parse(entry);
    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update journal entry",
    });
  }
}

export async function deleteEntry(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedParams = EntryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id",
      });
    }

    const existing = await prisma.journalEntry.findUnique({
      where: { id: parsedParams.data.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await prisma.journalEntry.delete({
      where: { id: parsedParams.data.id },
    });

    return res.json({ success: true, message: "Journal entry deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete journal entry",
    });
  }
}

export async function getStreak(req: Request, res: Response) {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    if (entries.length === 0) {
      return res.json({ success: true, data: { streak: 0 } });
    }

    const dates = [
      ...new Set(
        entries.map(
          (e) =>
            `${e.createdAt.getFullYear()}-${String(e.createdAt.getMonth() + 1).padStart(2, "0")}-${String(e.createdAt.getDate()).padStart(2, "0")}`,
        ),
      ),
    ];

    let streak = 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (dates[0] !== todayStr && dates[0] !== yesterdayStr()) {
      return res.json({ success: true, data: { streak: 0 } });
    }

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedStr = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, "0")}-${String(expected.getDate()).padStart(2, "0")}`;

      if (dates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return res.json({ success: true, data: { streak } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch streak",
    });
  }
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
