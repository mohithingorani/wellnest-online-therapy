import { useEffect, useRef, useCallback, useState } from "react";
import { getSocket, disconnectSocket } from "../services/socket";
import type { Message } from "../services/messages";

interface UseSocketReturn {
  connected: boolean;
  joinConversation: (convId: number) => void;
  leaveConversation: (convId: number) => void;
  sendMessage: (conversationId: number, content: string) => void;
  onNewMessage: (cb: (msg: Message) => void) => () => void;
  onTyping: (cb: (data: { conversationId: number; userId?: number; therapistId?: number }) => void) => () => void;
  offTyping: (cb: (data: { conversationId: number }) => void) => () => void;
}

export function useSocket(): UseSocketReturn {
  const [connected, setConnected] = useState(false);
  const newMessageCbRef = useRef<((msg: Message) => void) | null>(null);
  const typingStartCbRef = useRef<((data: any) => void) | null>(null);
  const typingStopCbRef = useRef<((data: any) => void) | null>(null);

  useEffect(() => {
    const s = getSocket();
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("message:new", (msg: Message) => {
      newMessageCbRef.current?.(msg);
    });
    s.on("typing:start", (data: any) => {
      typingStartCbRef.current?.(data);
    });
    s.on("typing:stop", (data: any) => {
      typingStopCbRef.current?.(data);
    });

    if (s.connected) setConnected(true);

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("message:new");
      s.off("typing:start");
      s.off("typing:stop");
      disconnectSocket();
    };
  }, []);

  const joinConversation = useCallback((convId: number) => {
    getSocket().emit("conversation:join", convId);
  }, []);

  const leaveConversation = useCallback((convId: number) => {
    getSocket().emit("conversation:leave", convId);
  }, []);

  const sendMessage = useCallback(
    (conversationId: number, content: string) => {
      getSocket().emit("message:send", { conversationId, content });
    },
    [],
  );

  const onNewMessage = useCallback((cb: (msg: Message) => void) => {
    newMessageCbRef.current = cb;
    return () => { newMessageCbRef.current = null; };
  }, []);

  const onTyping = useCallback(
    (cb: (data: { conversationId: number; userId?: number; therapistId?: number }) => void) => {
      typingStartCbRef.current = cb;
      return () => { typingStartCbRef.current = null; };
    },
    [],
  );

  const offTyping = useCallback(
    (cb: (data: { conversationId: number }) => void) => {
      typingStopCbRef.current = cb;
      return () => { typingStopCbRef.current = null; };
    },
    [],
  );

  return {
    connected,
    joinConversation,
    leaveConversation,
    sendMessage,
    onNewMessage,
    onTyping,
    offTyping,
  };
}
