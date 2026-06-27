"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { sendMessageToAI } from "@/app/service/chatAI";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Leaf,
  RotateCcw,
} from "lucide-react";

// ─── Tipe Data ──────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Konstanta ──────────────────────────────────────────────────────────────

const GREETING: Message = {
  role: "assistant",
  content:
    "Halo! Aku Limbara AI 🌱 Tanya apa saja soal sampah, daur ulang, atau cara hidup lebih ramah lingkungan. Aku siap bantu!",
};

// ─── Komponen Bubble ────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar AI */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center">
          <Leaf className="w-3.5 h-3.5 text-green-700" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-green-800 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

// ─── Komponen Utama ─────────────────────────────────────────────────────────

export default function ChatbotWidget() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Auth check ──────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };

    checkSession();

    // Dengarkan perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      // Reset chat saat logout
      if (!session?.user) {
        setIsOpen(false);
        setMessages([GREETING]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auto-scroll ke pesan terbaru ────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Auto-focus input saat buka panel ───────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Kirim pesan ─────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };

    // Tambah pesan user ke UI dulu (optimistic)
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Susun riwayat percakapan untuk multi-turn
    // Kirim semua pesan kecuali greeting awal agar context window tetap efisien
    const history = [...messages.slice(1), userMessage];
    const conversationText = history
      .map((m) => `${m.role === "user" ? "User" : "Limbara AI"}: ${m.content}`)
      .join("\n");

    try {
      const reply = await sendMessageToAI(conversationText);
      setMessages((prev) => [...prev, { role: "assistant", content: reply ?? "Maaf, aku tidak bisa menjawab saat ini." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ups, terjadi kesalahan. Coba lagi ya! 🙏" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // ── Submit dengan Enter (Shift+Enter untuk newline) ─────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Reset percakapan ────────────────────────────────────────────
  const handleReset = () => {
    setMessages([GREETING]);
    setInput("");
  };

  // Sembunyikan widget jika belum login
  if (!isLoggedIn) return null;

  return (
    <>
      {/* ── Panel Chat ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] bg-[#F7F8F4] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="bg-green-800 px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">Limbara AI</p>
                  <p className="text-green-300 text-[11px]">Asisten Sampah & Lingkungan</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset percakapan"
                  className="p-2 text-green-300 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-green-300 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Area Pesan */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} message={msg} />
              ))}

              {/* Indikator loading (typing dots) */}
              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center">
                    <Leaf className="w-3.5 h-3.5 text-green-700" />
                  </div>
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white px-3 py-3 flex items-end gap-2 flex-shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya soal sampah..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all max-h-28 leading-relaxed disabled:opacity-60"
                style={{ overflowY: input.split("\n").length > 3 ? "auto" : "hidden" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex-shrink-0 bg-green-800 hover:bg-green-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-2xl flex items-center justify-center transition-all shadow-sm disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ──────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        title={isOpen ? "Tutup chat" : "Buka Limbara AI"}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-green-800 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}