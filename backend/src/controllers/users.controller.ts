import argon2 from "argon2";
import { Request, Response } from "express";
import { z } from "zod";
import { awardSeeds, grantAchievement, SEED_AMOUNTS } from "../services/seeds";
import {
  AuthLoginSchema,
  AuthSignupSchema,
  PublicUserSchema,
} from "../inputs";
import { prisma } from "../db/prisma";
import {
  clearAuthCookie,
  createSession,
  deleteSession,
  setAuthCookie,
} from "../auth/session";

export async function signup(req: Request, res: Response) {
  try {
    const parsed = AuthSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await argon2.hash(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
      },
    });

    const { sessionToken } = await createSession(user.id);
    setAuthCookie(res, sessionToken);

    // Welcome seeds + first-seed achievement
    await awardSeeds(user.id, "signup", SEED_AMOUNTS.signup);
    await grantAchievement(user.id, "first_seed");

    const safeUser = PublicUserSchema.parse(user);
    return res.status(201).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = AuthLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      parsed.data.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { sessionToken } = await createSession(user.id);
    setAuthCookie(res, sessionToken);

    const safeUser = PublicUserSchema.parse(user);
    return res.json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    if (req.sessionToken) {
      await deleteSession(req.sessionToken);
    }
    clearAuthCookie(res);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const safeUser = PublicUserSchema.parse(req.authUser);
    return res.json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
}
