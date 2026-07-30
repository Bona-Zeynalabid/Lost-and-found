"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b">
      <div className="flex items-center space-x-3">
        <span className="h-4 w-4 rounded-full bg-[var(--accent-gold)] inline-block"></span>
        <h1 className="font-serif-heading text-xl font-bold tracking-wide uppercase">
          FoundIt
        </h1>
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] hidden sm:inline">
          | Heritage Civic Ledger
        </span>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-3 py-1.5 text-xs tracking-wider uppercase border border-[var(--border-color)] rounded-md hover:border-[var(--accent-gold)] transition-colors"
      >
        {darkMode ? "Light Protocol" : "Dark Protocol"}
      </button>
    </header>
  );
}