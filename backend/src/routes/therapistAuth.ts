import { Router, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "../db/prisma";
import {
  THERAPIST_COOKIE_NAME,
  hashTherapistToken,
  requireTherapistAuth,
} from "../middleware/therapistAuth";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

const hashToken = hashTherapistToken;

function setCookie(res: Response, token: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  res.cookie(THERAPIST_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

function clearCookie(res: Response) {
  res.clearCookie(THERAPIST_COOKIE_NAME, {
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

    const therapist = await prisma.therapist.findUnique({ where: { email } });
    if (!therapist || !therapist.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const valid = await argon2.verify(therapist.passwordHash, password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken();
    const hashedToken = hashToken(token);

    await prisma.therapist.update({
      where: { id: therapist.id },
      data: { sessionToken: hashedToken, updatedAt: new Date() },
    });

    setCookie(res, token);

    res.json({
      success: true,
      data: {
        id: therapist.id,
        name: therapist.name,
        email: therapist.email,
        title: therapist.title,
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
    const token = req.cookies?.[THERAPIST_COOKIE_NAME];
    if (token && typeof token === "string") {
      const hashedToken = hashToken(token);
      await prisma.therapist.updateMany({
        where: { sessionToken: hashedToken },
        data: { sessionToken: null },
      });
    }
    clearCookie(res);
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

router.get("/me", requireTherapistAuth, async (req, res) => {
  try {
    const therapist = await prisma.therapist.findUnique({
      where: { id: req.therapistId },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        experience: true,
        gender: true,
      },
    });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    res.json({ success: true, data: therapist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get therapist",
    });
  }
});

export default router;
