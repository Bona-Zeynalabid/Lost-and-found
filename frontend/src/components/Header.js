"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/lib/store";
import AssistantPopup from "./AssistantPopup";

export default function Header() {
  const router = useRouter();
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const user = useStore((s) => s.user);
  const [showAssistant, setShowAssistant] = useState(false);

  const initials = user
    ? `${user.firstName?.charAt(0).toUpperCase() || ""}${user.lastName?.charAt(0).toUpperCase() || ""}`
    : "";

  return (
    <>
      <header className="glass-panel sticky top-0 z-40 w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <h1 className="font-serif-heading text-lg sm:text-xl font-bold tracking-wide uppercase">
            FoundIt
          </h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Assistant - Mobile only */}
          <button
            onClick={() => setShowAssistant(true)}
            className="sm:hidden relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors rounded-full hover:bg-[var(--accent-green)]/10"
            title="Ask Assistant"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            {/* Subtle glow effect */}
            <span className="absolute inset-0 rounded-full bg-[var(--accent-green)]/5 animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--border-color)]"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-[var(--border-color)] object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                {initials || "?"}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Assistant Popup */}
      {showAssistant && <AssistantPopup onClose={() => setShowAssistant(false)} />}
    </>
  );
}