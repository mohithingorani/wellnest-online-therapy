import { io, Socket } from "socket.io-client";

/* The REST base may include a trailing "/api" (e.g. https://api.host/api), but
   the socket server lives at the origin root, so strip it. In dev VITE_API_URL
   is unset → connect to same origin, where Vite proxies /socket.io → backend. */
const SOCKET_URL = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL || undefined, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
