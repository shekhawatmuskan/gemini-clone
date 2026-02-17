import React, { createContext, useEffect, useMemo, useState } from "react";
import runchat from "../config/runchat";

export const Context = createContext();

const STORAGE_KEY = "gemini-clone.chats.v1";
const STORAGE_ACTIVE_KEY = "gemini-clone.activeChatId.v1";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function buildNewChat() {
  const now = Date.now();
  return {
    id: createId(),
    title: "New chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([buildNewChat()]);

  const [activeChatId, setActiveChatId] = useState(chats[0].id);

  useEffect(() => {
    if (!activeChatId && chats[0]?.id) setActiveChatId(chats[0].id);
  }, [activeChatId, chats]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    if (activeChatId) localStorage.setItem(STORAGE_ACTIVE_KEY, activeChatId);
  }, [activeChatId]);

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [activeChatId, chats]);

  const messages = activeChat?.messages || [];

  const newChat = () => {
    const chat = buildNewChat();
    setChats((prev) => [chat, ...prev].slice(0, 30));
    setActiveChatId(chat.id);
    setLoading(false);
    setInput("");
  };

  const clearChat = () => {
    if (!activeChat?.id) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [], updatedAt: Date.now() } : c,
      ),
    );
  };

  const onSent = async (prompt) => {
    const text = (prompt ?? input).trim();
    if (!text || !activeChat?.id) return;

    const historyBeforeSend = messages;
    const now = Date.now();

    // Optimistic UI: add user message immediately
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChat.id) return c;
        const nextTitle = c.title === "New chat" ? text.slice(0, 32) : c.title;
        return {
          ...c,
          title: nextTitle,
          messages: [...c.messages, { role: "user", content: text, createdAt: now }],
          updatedAt: now,
        };
      }),
    );

    setLoading(true);
    setInput("");

    try {
      const response = await runchat(text, historyBeforeSend);
      const stamp = Date.now();

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          return {
            ...c,
            messages: [...c.messages, { role: "assistant", content: response, createdAt: stamp }],
            updatedAt: stamp,
          };
        }),
      );
    } catch (error) {
      const errorMsg =
        error?.message || "An error occurred. Please try again.";
      const pretty =
        error?.name === "QuotaExceededError" ||
          errorMsg.toLowerCase().includes("quota") ||
          errorMsg.includes("429")
          ? `⚠️ ${errorMsg}`
          : `❌ Error: ${errorMsg}`;

      const stamp = Date.now();
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          return {
            ...c,
            messages: [...c.messages, { role: "assistant", content: pretty, createdAt: stamp }],
            updatedAt: stamp,
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const regenerateLast = async () => {
    if (!activeChat?.id || loading) return;

    const currentMessages = messages;
    let lastUserIndex = -1;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i]?.role === "user") {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;

    const prompt = (currentMessages[lastUserIndex]?.content || "").trim();
    if (!prompt) return;

    // Remove trailing assistant message (if any) before regenerating
    const trimmedMessages =
      currentMessages[currentMessages.length - 1]?.role === "assistant"
        ? currentMessages.slice(0, -1)
        : currentMessages;

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: trimmedMessages, updatedAt: Date.now() } : c,
      ),
    );

    setLoading(true);
    try {
      const historyBeforePrompt = trimmedMessages.slice(0, lastUserIndex);
      const response = await runchat(prompt, historyBeforePrompt);
      const stamp = Date.now();
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          return {
            ...c,
            messages: [...trimmedMessages, { role: "assistant", content: response, createdAt: stamp }],
            updatedAt: stamp,
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    onSent,
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    loading,
    input,
    setInput,
    newChat,
    clearChat,
    regenerateLast,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
