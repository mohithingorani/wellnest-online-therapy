import { Router } from "express";
import { prisma } from "../db/prisma";
import { optionalAuth } from "../middleware/auth";

const router = Router();

/* POST /api/waitlist — join therapist waitlist (auth optional) */
router.post("/", optionalAuth, async (req, res) => {
  const { email, city, concern } = req.body as { email: string; city?: string; concern?: string };
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const existing = await prisma.waitlistEntry.findFirst({ where: { email } });
  if (existing) return res.json({ success: true, data: { alreadyJoined: true } });

  const entry = await prisma.waitlistEntry.create({
    data: {
      email,
      city: city ?? null,
      concern: concern ?? null,
      userId: req.authUser?.id ?? null,
    },
  });

  res.json({ success: true, data: { entry, alreadyJoined: false } });
});

/* GET /api/waitlist/count — public count for social proof */
router.get("/count", async (_req, res) => {
  const count = await prisma.waitlistEntry.count();
  res.json({ success: true, data: { count } });
});

export default router;
