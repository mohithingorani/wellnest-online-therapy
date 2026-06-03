import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../db/prisma";
import { awardSeeds, grantAchievement, SEED_AMOUNTS } from "../services/seeds";
import crypto from "crypto";

const router = Router();

/* GET /api/referrals/me — get or create referral code */
router.get("/me", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  let ref = await prisma.referralCode.findUnique({ where: { userId } });
  if (!ref) {
    const code = crypto.randomBytes(5).toString("hex").toUpperCase();
    ref = await prisma.referralCode.create({ data: { userId, code } });
  }
  res.json({ success: true, data: ref });
});

/* POST /api/referrals/use — called during signup with ?ref=CODE */
router.post("/use", async (req, res) => {
  const { code, newUserId } = req.body as { code: string; newUserId: number };
  if (!code || !newUserId) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const ref = await prisma.referralCode.findUnique({ where: { code: code.toUpperCase() } });
  if (!ref) return res.status(404).json({ success: false, message: "Invalid referral code" });
  if (ref.userId === newUserId) return res.status(400).json({ success: false, message: "Cannot use own code" });

  await prisma.referralCode.update({ where: { code: ref.code }, data: { uses: { increment: 1 } } });
  await prisma.user.update({ where: { id: newUserId }, data: { referredBy: ref.userId } });

  // Award both sides
  await awardSeeds(ref.userId, "referral", SEED_AMOUNTS.referral, `ref_${newUserId}`);
  await grantAchievement(ref.userId, "connector");

  res.json({ success: true });
});

/* GET /api/referrals/stats — how many people you've referred */
router.get("/stats", requireAuth, async (req, res) => {
  const userId = req.authUser!.id;
  const [ref, referredCount] = await Promise.all([
    prisma.referralCode.findUnique({ where: { userId } }),
    prisma.user.count({ where: { referredBy: userId } }),
  ]);
  res.json({ success: true, data: { code: ref?.code ?? null, uses: ref?.uses ?? 0, referredCount } });
});

export default router;
