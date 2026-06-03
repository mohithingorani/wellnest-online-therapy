import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import {
  messagesService,
  type ConversationListItem,
  type Message,
} from "../services/messages";

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ConversationSkeleton() {
  return (
    <div className="space-y-1 p-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-surface-2 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3 w-24 rounded bg-surface-2" />
            <div className="h-2.5 w-40 rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ThreadSkeleton() {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`h-10 rounded-2xl bg-surface-2 ${
              i % 2 === 0 ? "w-48" : "w-36"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? "bg-accent text-primary-fg rounded-br-md"
            : "bg-surface-2 text-fg-strong rounded-bl-md ring-1 ring-border"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`text-[10px] mt-1 text-right ${
            isOwn ? "text-primary-fg/60" : "text-fg-muted"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="border-t border-border p-4 bg-surface">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type a message..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-2xl bg-surface-2 ring-1 ring-border px-4 py-2.5 text-sm text-fg-strong placeholder-fg-muted outline-none focus:ring-accent disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="h-10 w-10 rounded-full bg-accent text-primary-fg grid place-items-center hover:bg-accent-hover transition-colors disabled:opacity-40 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-7-7m7 7l-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const socket = useSocket();

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<ConversationListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesService
      .listConversations()
      .then((res) => {
        if (res.success && res.data) setConversations(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = useCallback(async (convId: number) => {
    setMessagesLoading(true);
    try {
      const res = await messagesService.getMessages(convId);
      if (res.success && res.data) {
        setMessages(res.data.messages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const selectConversation = useCallback(
    async (conv: ConversationListItem) => {
      setActiveConv(conv);
      setMobileView("thread");
      socket.joinConversation(conv.id);
      await loadMessages(conv.id);
    },
    [socket, loadMessages],
  );

  useEffect(() => {
    const unsub = socket.onNewMessage((msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMessage: msg, updatedAt: msg.createdAt }
            : c,
        ),
      );
      if (msg.conversationId === activeConv?.id) {
        setTimeout(() => {
          threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    });
    return unsub;
  }, [socket, activeConv?.id]);

  useEffect(() => {
    const unsub = socket.onTyping((data) => {
      if (data.conversationId === activeConv?.id) {
        setTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
      }
    });
    return unsub;
  }, [socket, activeConv?.id]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = useCallback(
    (content: string) => {
      if (!activeConv) return;
      socket.sendMessage(activeConv.id, content);
    },
    [socket, activeConv],
  );

  const handleBack = () => {
    if (activeConv) socket.leaveConversation(activeConv.id);
    setActiveConv(null);
    setMessages([]);
    setMobileView("list");
  };

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [conversations],
  );

  if (error) {
    return (
      <div className="bg-bg flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-68px)] animate-page">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-error/10 text-error grid place-items-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="font-display text-lg font-medium text-fg-strong mb-1">Something went wrong</h3>
          <p className="text-sm text-fg-muted mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); messagesService.listConversations().then((res) => { if (res.success && res.data) setConversations(res.data); }).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
            className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-bg flex-1 flex h-[calc(100vh-68px)]">
        <div className="hidden lg:flex flex-col w-[340px] border-r border-border shrink-0">
          <div className="px-5 py-5 border-b border-border">
            <div className="h-6 w-28 rounded bg-surface-2 animate-pulse" />
          </div>
          <ConversationSkeleton />
        </div>
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-surface-2 animate-pulse" />
        </div>
        <div className="lg:hidden w-full"><ConversationSkeleton /></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-bg flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-68px)] animate-page">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-clay-200 to-ochre-200 text-fg-muted grid place-items-center mx-auto mb-5 shadow-soft">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" /></svg>
          </div>
          <h3 className="font-display text-2xl font-medium text-fg-strong mb-1">No conversations yet</h3>
          <p className="text-sm text-fg-muted leading-relaxed mb-5 max-w-xs mx-auto">Once you book or reach out to a therapist, your conversations will live here.</p>
          <button
            onClick={() => navigate("/therapists")}
            className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft"
          >
            Browse therapists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg flex-1 flex h-[calc(100vh-68px)] animate-page">
      {/* Conversation list — desktop always visible, mobile toggle */}
      <div
        className={`${
          mobileView === "list" ? "flex" : "hidden"
        } lg:flex flex-col w-full lg:w-[340px] border-r border-border shrink-0 bg-surface`}
      >
        <div className="px-5 py-5 border-b border-border">
          <h2 className="font-display text-xl font-medium text-fg-strong tracking-[-0.01em]">Messages</h2>
          <p className="text-xs text-fg-muted mt-0.5">{sortedConversations.length} conversation{sortedConversations.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sortedConversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-colors ${
                  isActive ? "bg-accent/10" : "hover:bg-surface-2"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-clay-400 to-ochre-400 text-white grid place-items-center font-display text-sm font-semibold shrink-0">
                  {conv.therapist.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold truncate ${isActive ? "text-accent" : "text-fg-strong"}`}>
                      {conv.therapist.name}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-fg-muted shrink-0">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fg-muted truncate mt-0.5">
                    {conv.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message thread */}
      <div
        className={`${
          mobileView === "thread" ? "flex" : "hidden"
        } lg:flex flex-1 flex-col min-w-0`}
      >
        {activeConv ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface shrink-0">
              <button
                onClick={handleBack}
                className="lg:hidden p-1 -ml-1 text-fg-muted hover:text-fg-strong"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clay-400 to-ochre-400 text-white grid place-items-center font-display text-sm font-semibold shrink-0">
                {activeConv.therapist.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-fg-strong truncate">
                  {activeConv.therapist.name}
                </div>
                <div className="text-xs text-fg-muted truncate">
                  {activeConv.therapist.title}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-fg-muted">
                <span className={`w-2 h-2 rounded-full ${socket.connected ? "bg-success" : "bg-warning"}`} />
                {socket.connected ? "Online" : "Connecting"}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
              {messagesLoading ? (
                <ThreadSkeleton />
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-sm text-fg-muted">No messages yet</p>
                    <p className="text-xs text-fg-muted mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderType === "user"}
                  />
                ))
              )}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-surface-2 text-fg-muted text-xs rounded-2xl rounded-bl-md px-4 py-2 ring-1 ring-border">
                    {activeConv.therapist.name.split(" ")[0]} is typing...
                  </div>
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={!socket.connected} />
          </>
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-clay-200 to-ochre-200 text-fg-muted grid place-items-center mx-auto mb-5 shadow-soft">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" /></svg>
              </div>
              <h3 className="font-display text-xl font-medium text-fg-strong mb-1">
                Select a conversation
              </h3>
              <p className="text-sm text-fg-muted">
                Choose a conversation on the left to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
