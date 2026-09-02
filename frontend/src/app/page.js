"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AssistantPopup from "@/components/AssistantPopup";

export default function LandingPage() {
  const router = useRouter();
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8 sm:py-16 px-4">
        <section className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal leading-tight text-[var(--text-primary)]">
            Lost Something?<br />We'll Help You Find It.
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
            FoundIt connects communities through a trusted platform where lost items find their way back home.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 ">
            <button
              onClick={() => router.push("/auth")}
              className="px-8 py-3.5 bg-[var(--accent-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              Get Started
            </button>
             <button
              onClick={() => router.push("/police")}
              className="px-8 py-3.5 border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--border-color)] transition-all"
            >
              Police Portal
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            © 2026 FoundIt. Built by Bona Zeynalabid
          </p>
        </div>
      </footer>

      {/* Floating Assistant Button */}
      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent-green)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all z-40 flex items-center justify-center"
        aria-label="Open assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Assistant Popup */}
      {showAssistant && <AssistantPopup onClose={() => setShowAssistant(false)} />}
    </div>
  );
}