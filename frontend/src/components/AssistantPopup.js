"use client";
import { useState, useRef, useEffect } from "react";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `You are the FoundIt Assistant, a helpful guide for the FoundIt lost-and-found platform.

## What FoundIt Is
FoundIt is a community-driven platform that helps people recover lost items by connecting those who lost something with those who found something. Users can report lost or found items, the system automatically matches them, and users get notified when a potential match is found.

## Key Features You Can Help With
- **Report Lost Item**: Users can file a detailed report with category-specific fields (Phone, ID, Keys, Bag, Wallet, Pet, etc.), upload images, add location and contact info.
- **Report Found Item**: Similar to lost items, but with visibility options (public or hidden).
- **Dashboard**: Browse all lost and found items, search by category, type, or keywords.
- **Notifications**: Get alerts when a potential match is found for your report.
- **Community Forum**: Discussion board where users can post, reply, and like posts.
- **Profile**: View your stats, update password, connect Telegram for notifications.
- **Google Sign-In**: Users can sign up with Google and set a password later.

## How to Use the Platform
1. Sign in with Google or email/password
2. Report a lost or found item from the dashboard or sidebar
3. Browse items and use search filters
4. When a match is found, you'll receive a notification
5. Contact the other party using the provided contact info
6. Mark items as resolved when recovered

## Important Notes
- Always provide accurate information when reporting items
- Contact information (phone/email) is visible to other users for recovery purposes
- Hidden found items are only shown as matches, not publicly
- You can connect Telegram to receive instant match notifications
- The matching algorithm works automatically when you post a new item

## Your Role
- Answer questions about how to use FoundIt
- Guide users through reporting items
- Explain features and settings
- Help troubleshoot common issues
- Be friendly, concise, and helpful
- Keep responses under 3-4 sentences when possible`;

const FALLBACK_RESPONSES = [
  "I'm having trouble connecting right now. Please try again in a moment.",
  "Sorry, I couldn't process that. You can try asking again or check our About page for more information.",
  "It seems I'm temporarily unavailable. Feel free to browse the dashboard or check your notifications while I recover.",
  "I encountered a small issue. Please try your question again shortly.",
];

function getRandomFallback() {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

export default function AssistantPopup({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm the FoundIt assistant. I can help you with reporting items, finding matches, using the community forum, and more. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addAssistantMessage = (text) => {
    setMessages((prev) => [...prev, { role: "assistant", text }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // Add empty assistant placeholder
    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    setLoading(true);

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
          .filter((m) => m.text) // skip empty loading messages
          .map((msg) => ({
            role: msg.role,
            content: msg.text,
          })),
        { role: "user", content: userMessage },
      ];

      const stream = await openrouter.chat.send({
        chatRequest: {
          model: "openrouter/free",
          messages: apiMessages,
          stream: true,
        },
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", text: fullResponse };
            return updated;
          });
        }
      }

      // If stream ended with empty response
      if (!fullResponse) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: getRandomFallback() };
          return updated;
        });
      }
    } catch (err) {
      // Replace the empty placeholder with a friendly fallback message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: getRandomFallback(),
        };
        return updated;
      });

      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Assistant error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Popup */}
      <div className="relative bg-[var(--bg-main)] rounded-2xl shadow-2xl w-full max-w-md h-[550px] z-10 border border-[var(--border-color)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-sm text-[var(--text-primary)]">Assistant</span>
              <p className="text-[10px] text-[var(--text-secondary)]">Powered by AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-[var(--accent-green)]/10 flex items-center justify-center shrink-0 mr-2 mt-1">
                  <svg className="w-4 h-4 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--accent-green)] text-white rounded-br-md"
                    : msg.text
                    ? "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-md"
                    : ""
                }`}
              >
                {msg.text || (
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--border-color)] shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about FoundIt..."
              disabled={loading}
              className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 text-sm rounded-xl focus:outline-none focus:border-[var(--accent-gold)] disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-[var(--accent-green)] text-white text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}