import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import crypto from "crypto";
import { prisma } from "../db/prisma";
import { AUTH_COOKIE_NAME } from "../auth/session";
import { THERAPIST_COOKIE_NAME } from "../middleware/therapistAuth";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://wellnest.mohit.systems"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");

      const userToken = cookies[AUTH_COOKIE_NAME];
      const therapistToken = cookies[THERAPIST_COOKIE_NAME];

      if (userToken && typeof userToken === "string") {
        const hashed = hashToken(userToken);
        const session = await prisma.session.findUnique({
          where: { sessionToken: hashed },
          include: { user: true },
        });
        if (session && session.expiresAt > new Date()) {
          (socket.data as any).userId = session.user.id;
          (socket.data as any).user = session.user;
          return next();
        }
      }

      if (therapistToken && typeof therapistToken === "string") {
        const hashed = hashToken(therapistToken);
        const therapist = await prisma.therapist.findUnique({
          where: { sessionToken: hashed },
        });
        if (therapist) {
          (socket.data as any).therapistId = therapist.id;
          (socket.data as any).therapist = therapist;
          return next();
        }
      }

      return next(new Error("Authentication required"));
    } catch (err) {
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket.data as any).userId;
    const therapistId = (socket.data as any).therapistId;

    socket.on("conversation:join", (conversationId: number) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId: number) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on(
      "message:send",
      async (data: { conversationId: number; content: string }) => {
        try {
          const conversation = await prisma.conversation.findUnique({
            where: { id: data.conversationId },
          });

          if (!conversation) return;

          if (
            !(userId && conversation.userId === userId) &&
            !(therapistId && conversation.therapistId === therapistId)
          ) {
            return;
          }

          const senderType = userId ? "user" : "therapist";
          const senderId = userId || therapistId!;

          const message = await prisma.message.create({
            data: {
              content: data.content,
              conversationId: data.conversationId,
              senderType,
              senderId,
            },
          });

          await prisma.conversation.update({
            where: { id: data.conversationId },
            data: { updatedAt: new Date() },
          });

          io.to(`conv:${data.conversationId}`).emit("message:new", message);
        } catch (error) {
          console.error("Socket message:send error", error);
        }
      },
    );

    socket.on(
      "typing:start",
      (conversationId: number) => {
        socket.to(`conv:${conversationId}`).emit("typing:start", {
          conversationId,
          userId,
          therapistId,
        });
      },
    );

    socket.on(
      "typing:stop",
      (conversationId: number) => {
        socket.to(`conv:${conversationId}`).emit("typing:stop", {
          conversationId,
        });
      },
    );

    socket.on("disconnect", () => {});
  });

  return io;
}
