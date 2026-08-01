"use client";
import useStore from "@/lib/store";

export default function ThemeToggle() {
  const darkMode = useStore((s) => s.darkMode);
  const toggle = useStore((s) => s.toggleDarkMode);

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-xs uppercase tracking-widest border border-[var(--border-color)] hover:border-[var(--accent-gold)] transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}