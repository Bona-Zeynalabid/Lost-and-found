"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "My Activity",
      href: "/myactivity",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: "Notifications",
      href: "/notification",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      name: "Community",
      href: "/community",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Profile ",
      href: "/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: "About Us",
      href: "/about",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const row1 = links.slice(0, 3);
  const row2 = links.slice(3, 6);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden glass-panel fixed bottom-0 left-0 right-0 border-t border-[var(--border-color)] z-30">
        <div className="flex flex-col">
          <div className="flex justify-around py-1 border-b border-[var(--border-color)]/50">
            {row1.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center px-3 py-1 rounded-xs transition-colors ${
                    isActive
                      ? "bg-[var(--accent-green)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">{link.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex justify-around py-1">
            {row2.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center px-3 py-1 rounded-xs transition-colors ${
                    isActive
                      ? "bg-[var(--accent-green)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop: Sidebar */}
      <nav
        className={`hidden sm:block glass-panel sm:sticky sm:top-0 sm:h-screen p-3 border-r border-[var(--border-color)] z-30 transition-all duration-300 ${
          collapsed ? "sm:w-16" : "sm:w-64"
        }`}
      >
        <div className="flex sm:flex-col justify-around sm:justify-start space-x-1 sm:space-x-0 sm:space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden sm:flex items-center justify-between w-full px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={collapsed ? "Expand Navigation" : "Collapse Navigation"}
          >
            {!collapsed && <span>Directory</span>}
            <svg
              className={`w-3.5 h-3.5 transform transition-transform ${
                collapsed ? "rotate-180 mx-auto" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.name : ""}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xs text-[11px] font-medium tracking-wider uppercase transition-all ${
                  collapsed ? "justify-center" : "justify-start"
                } ${
                  isActive
                    ? "bg-[var(--accent-green)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]"
                }`}
              >
                <span className="shrink-0">{link.icon}</span>
                {!collapsed && (
                  <span className="truncate hidden sm:inline">{link.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}