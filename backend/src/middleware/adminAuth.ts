import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db/prisma";

export const ADMIN_COOKIE_NAME = "wellnest_admin";

export function hashAdminToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.[ADMIN_COOKIE_NAME];
    if (!token || typeof token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const hashedToken = hashAdminToken(token);
    const admin = await prisma.admin.findUnique({
      where: { sessionToken: hashedToken },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    req.adminId = admin.id;
    req.adminRole = admin.role;
    return next();
  } catch (error) {
    return next(error);
  }
}
