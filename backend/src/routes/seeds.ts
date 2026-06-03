import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../db/prisma";
import { awardSeeds, getTotal, SEED_AMOUNTS, grantAchievement } from "../services/seeds";

const router = Router();

/* GET /api/seeds/me — current total + last 20 transactions */
router.get("/me", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const [seeds, transactions] = await Promise.all([
    prisma.userSeeds.findUnique({ where: { userId } }),
    prisma.seedTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  res.json({
    success: true,
    data: {
      total: seeds?.total ?? 0,
      lifetimeEarned: seeds?.lifetimeEarned ?? 0,
      transactions,
    },
  });
});

/* POST /api/seeds/award — client-side actions (breathing etc.) */
router.post("/award", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const { reason } = req.body as { reason: keyof typeof SEED_AMOUNTS };
  if (!reason || !(reason in SEED_AMOUNTS)) {
    return res.status(400).json({ success: false, message: "Invalid reason" });
  }
  // Only allow client-safe reasons — server handles journal/signup/referral
  const clientAllowed = new Set(["breathing_session", "resource_read", "daily_checkin"]);
  if (!clientAllowed.has(reason)) {
    return res.status(403).json({ success: false, message: "Use server-side award for this action" });
  }
  const result = await awardSeeds(userId, reason, SEED_AMOUNTS[reason]);
  res.json({ success: true, data: result });
});

/* POST /api/seeds/complete-challenge — weekly challenge completion
   The frontend tracks daily progress in localStorage; this route awards
   the completion bonus and grants achievements when the week is done. */
router.post("/complete-challenge", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const { challengeId, seeds } = req.body as { challengeId: string; seeds: number };
  if (!challengeId || typeof seeds !== "number" || seeds <= 0 || seeds > 50) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }
  // Dedup by challenge + week key (prevents double-claim)
  const weekKey = (() => {
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const w = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}_w${w}`;
  })();
  const result = await awardSeeds(userId, "weekly_challenge", seeds, `${challengeId}_${weekKey}`);
  res.json({ success: true, data: result });
});

/* GET /api/seeds/achievements — earned badges */
router.get("/achievements", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" },
  });
  res.json({ success: true, data: achievements });
});

export default router;
