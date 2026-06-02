import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db/prisma";

export const THERAPIST_COOKIE_NAME = "wellnest_therapist";

export function hashTherapistToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requireTherapistAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.[THERAPIST_COOKIE_NAME];
    if (!token || typeof token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const hashedToken = hashTherapistToken(token);
    const therapist = await prisma.therapist.findUnique({
      where: { sessionToken: hashedToken },
    });

    if (!therapist) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    req.therapistId = therapist.id;
    return next();
  } catch (error) {
    return next(error);
  }
}
