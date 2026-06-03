import { prisma } from "../db/prisma";

/* Seed amounts per action */
export const SEED_AMOUNTS = {
  signup:           30,
  daily_checkin:     5,
  journal_entry:    10,
  breathing_session: 8,
  assessment:       15,
  resource_read:     3,
  streak_3day:      15,
  streak_7day:      40,
  streak_30day:    150,
  referral:         75,
  weekly_challenge: 35,
} as const;

export type SeedReason = keyof typeof SEED_AMOUNTS;

/* Award seeds to a user.
   Daily-capped reasons (checkin, journal, breathing) can only fire once per UTC day.
   One-time reasons (signup, assessment per type) use the meta field for dedup. */
export async function awardSeeds(
  userId: number,
  reason: SeedReason,
  amount: number,
  meta?: string
): Promise<{ awarded: boolean; total: number }> {
  const DAILY = new Set<SeedReason>(["daily_checkin", "journal_entry", "breathing_session"]);

  if (DAILY.has(reason)) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const existing = await prisma.seedTransaction.findFirst({
      where: { userId, reason, createdAt: { gte: startOfDay } },
    });
    if (existing) return { awarded: false, total: await getTotal(userId) };
  }

  if (meta) {
    const existing = await prisma.seedTransaction.findFirst({
      where: { userId, reason, meta },
    });
    if (existing) return { awarded: false, total: await getTotal(userId) };
  }

  const [, , seeds] = await prisma.$transaction([
    prisma.seedTransaction.create({ data: { userId, amount, reason, meta } }),
    prisma.userSeeds.upsert({
      where: { userId },
      create: { userId, total: amount, lifetimeEarned: amount },
      update: { total: { increment: amount }, lifetimeEarned: { increment: amount } },
    }),
    prisma.userSeeds.findUnique({ where: { userId } }),
  ]);

  // After daily checkin: check streak bonuses + streak achievements
  if (reason === "daily_checkin") {
    await checkStreakBonus(userId);
  }

  // After breathing session: check calm_mind achievement (10 sessions)
  if (reason === "breathing_session") {
    const count = await prisma.seedTransaction.count({
      where: { userId, reason: "breathing_session" },
    });
    if (count >= 10) await grantAchievement(userId, "calm_mind");
  }

  return { awarded: true, total: (seeds?.total ?? 0) + amount };
}

export async function getTotal(userId: number): Promise<number> {
  const s = await prisma.userSeeds.findUnique({ where: { userId } });
  return s?.total ?? 0;
}

/* Award streak bonuses + grant streak achievements after a daily checkin */
async function checkStreakBonus(userId: number) {
  const rows = await prisma.seedTransaction.findMany({
    where: { userId, reason: "daily_checkin" },
    orderBy: { createdAt: "desc" },
    take: 31,
  });

  const streak = computeStreak(rows.map((r) => r.createdAt));

  // Grant achievements (idempotent)
  if (streak >= 30) {
    await awardSeeds(userId, "streak_30day", SEED_AMOUNTS.streak_30day, `streak_30_${weekKey()}`);
    await grantAchievement(userId, "month_strong");
  } else if (streak >= 7) {
    await awardSeeds(userId, "streak_7day", SEED_AMOUNTS.streak_7day, `streak_7_${weekKey()}`);
    await grantAchievement(userId, "week_warrior");
  } else if (streak >= 3) {
    await awardSeeds(userId, "streak_3day", SEED_AMOUNTS.streak_3day, `streak_3_${weekKey()}`);
  }
}

function weekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}_w${week}`;
}

function computeStreak(dates: Date[]): number {
  if (!dates.length) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = dateDiffDays(dates[i - 1], dates[i]);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function dateDiffDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcA - utcB) / 86400000);
}

/* Grant an achievement (idempotent — @@unique enforces once per user) */
export async function grantAchievement(userId: number, slug: string): Promise<boolean> {
  try {
    await prisma.achievement.create({ data: { userId, slug } });
    return true;
  } catch {
    return false; // already earned
  }
}
