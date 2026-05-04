import crypto from "crypto";
import { Response } from "express";
import { prisma } from "../db/prisma";

export const AUTH_COOKIE_NAME = "wellnest_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: getSessionExpiryDate(),
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function createSession(userId: number) {
  const sessionToken = generateSessionToken();
  const hashedToken = hashSessionToken(sessionToken);
  const expiresAt = getSessionExpiryDate();

  await prisma.session.create({
    data: {
      userId,
      sessionToken: hashedToken,
      expiresAt,
    },
  });

  return { sessionToken, expiresAt };
}

export async function getSessionWithUser(sessionToken: string) {
  const hashedToken = hashSessionToken(sessionToken);

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashedToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session;
}

export async function deleteSession(sessionToken: string) {
  const hashedToken = hashSessionToken(sessionToken);
  await prisma.session.deleteMany({
    where: { sessionToken: hashedToken },
  });
}
