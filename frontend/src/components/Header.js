"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/lib/store";

export default function Header() {
  const router = useRouter();
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const user = useStore((s) => s.user);

  
  const initials = user
    ? `${user.firstName?.charAt(0).toUpperCase() || ""}${user.lastName?.charAt(0).toUpperCase() || ""}`
    : "";

  return (
    <header className="glass-panel sticky top-0 z-40 w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b">
    
      <Link href="/dashboard" className="flex items-center space-x-2">
        <h1 className="font-serif-heading text-lg sm:text-xl font-bold tracking-wide uppercase">
          FoundIt
        </h1>
      </Link>

      <div className="flex items-center space-x-2 sm:space-x-3">
        
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
  );
}