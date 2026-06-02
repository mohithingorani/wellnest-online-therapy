import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME, getSessionWithUser } from "../auth/session";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getSessionWithUser>>>["user"];

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      sessionToken?: string;
      adminId?: number;
      adminRole?: string;
      therapistId?: number;
    }
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token || typeof token !== "string") {
      return next();
    }

    const session = await getSessionWithUser(token);
    if (!session) {
      return next();
    }

    req.authUser = session.user;
    req.sessionToken = token;
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await optionalAuth(req, res, async () => {
    if (!req.authUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return next();
  });
}
