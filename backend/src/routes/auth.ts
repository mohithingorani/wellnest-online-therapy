import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import argon2 from "argon2";
import crypto from "crypto";
import { prisma } from "../db/prisma";
import { createSession, setAuthCookie } from "../auth/session";
import { PublicUserSchema } from "../inputs";

const router = Router();

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ success: false, message: "Missing credential" });
      return;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ success: false, message: "Invalid token" });
      return;
    }

    const { email, name: googleName, sub: googleId } = payload;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await argon2.hash(randomPassword);
      user = await prisma.user.create({
        data: {
          email,
          name: googleName || email.split("@")[0],
          passwordHash,
          googleId,
        },
      });
    }

    const { sessionToken, expiresAt } = await createSession(user.id);
    setAuthCookie(res, sessionToken);

    const safeUser = PublicUserSchema.parse(user);
    res.json({ success: true, data: safeUser });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
});

export default router;
