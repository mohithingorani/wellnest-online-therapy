import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../db/prisma";
import { awardSeeds, grantAchievement, SEED_AMOUNTS } from "../services/seeds";

const router = Router();

/* POST /api/assessments — save result, award seeds */
router.post("/", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const { type, score, band, answers } = req.body as {
    type: string; score: number; band: string; answers: Record<string, number>;
  };

  if (!type || score === undefined || !band || !answers) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const assessment = await prisma.assessment.create({
    data: { userId, type, score, band, answers },
  });

  // Award seeds (once per assessment type per day)
  const { awarded } = await awardSeeds(
    userId, "assessment", SEED_AMOUNTS.assessment, `${type}_${new Date().toISOString().slice(0, 10)}`
  );

  // Achievement: "Self-Aware" — completed all 4 assessments at least once
  const TYPES = ["gad7", "burnout", "stress", "mood"];
  const done = await prisma.assessment.findMany({
    where: { userId },
    distinct: ["type"],
    select: { type: true },
  });
  if (done.length >= TYPES.length) {
    await grantAchievement(userId, "self_aware");
  }

  res.json({ success: true, data: { assessment, seedsAwarded: awarded } });
});

/* GET /api/assessments/history */
router.get("/history", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const history = await prisma.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  res.json({ success: true, data: history });
});

/* GET /api/assessments/latest — one per type, most recent */
router.get("/latest", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const types = ["gad7", "burnout", "stress", "mood"];
  const latest = await Promise.all(
    types.map((t) =>
      prisma.assessment.findFirst({
        where: { userId, type: t },
        orderBy: { createdAt: "desc" },
      })
    )
  );
  res.json({ success: true, data: Object.fromEntries(types.map((t, i) => [t, latest[i]])) });
});

export default router;
