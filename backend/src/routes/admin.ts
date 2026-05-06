import { Router, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "../db/prisma";

const router = Router();

const ADMIN_COOKIE_NAME = "wellnest_admin";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateAdminToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function setAdminCookie(res: Response, token: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

function clearAdminCookie(res: Response) {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

router.post("/login", async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const valid = await argon2.verify(admin.password, password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateAdminToken();
    const hashedToken = hashToken(token);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        updatedAt: new Date(),
      },
    });

    setAdminCookie(res, token);

    res.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    clearAdminCookie(res);
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.[ADMIN_COOKIE_NAME];
    if (!token || typeof token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const hashedToken = hashToken(token);
    const admin = await prisma.admin.findFirst({
      where: { 
        id: { gt: 0 }
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get admin",
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [userCount, therapistCount, sessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.therapist.count(),
      prisma.session.count(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalTherapists: therapistCount,
        activeSessions: sessionCount,
        pendingApprovals: 0,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
});

router.get("/therapists", async (req, res) => {
  try {
    const therapists = await prisma.therapist.findMany({
      include: { specialities: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: therapists.map((t) => ({
        id: t.id,
        name: t.name,
        experience: t.experience,
        specialities: t.specialities,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        status: "active",
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch therapists",
    });
  }
});

router.patch("/therapists/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid therapist ID",
      });
    }

    const { name, experience } = req.body;

    const therapist = await prisma.therapist.update({
      where: { id },
      data: { name, experience },
      include: { specialities: true },
    });

    res.json({ success: true, data: therapist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update therapist",
    });
  }
});

router.delete("/therapists/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid therapist ID",
      });
    }

    await prisma.therapist.delete({ where: { id } });

    res.json({ success: true, message: "Therapist deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete therapist",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { sessions: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        sessionCount: u.sessions.length,
        status: "active",
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const recentTherapists = await prisma.therapist.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    });

    const activity = [
      ...recentUsers.map((u) => ({
        type: "user" as const,
        id: u.id,
        name: u.name,
        email: u.email,
        timestamp: u.createdAt,
      })),
      ...recentTherapists.map((t) => ({
        type: "therapist" as const,
        id: t.id,
        name: t.name,
        timestamp: t.createdAt,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
});

export default router;