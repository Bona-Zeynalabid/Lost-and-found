"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/lib/store";
import AssistantPopup from "./AssistantPopup";

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/stats`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats({
            lostCount: data.lostCount || 0,
            foundCount: data.foundCount || 0,
            resolvedCount: data.resolvedCount || 0,
          });
        }
      })
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notification`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
        }
      })
      .catch(() => {});
  }, [user]);

  const totalCases = stats.lostCount + stats.foundCount;

  return (
    <>
      <aside
        className={`glass-panel fixed top-14 right-0 h-[calc(100vh-3.5rem)] border-l border-[var(--border-color)] z-20 transition-all duration-300 hidden lg:flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button - Left aligned */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 w-full h-10 px-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-b border-[var(--border-color)] shrink-0"
        >
          <svg
            className={`w-3.5 h-3.5 transform transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-[10px] uppercase tracking-widest">Panel</span>}
        </button>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!collapsed ? (
            <>
              {/* User Section */}
              <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center font-serif-heading font-bold text-sm shrink-0">
                    {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase() || ""}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-3 pt-3 border-t border-[var(--border-color)] text-xs">
                  <Link href="/notifications" className="hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1 text-[var(--text-secondary)]">
                    Alerts
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[var(--accent-gold)] text-[var(--bg-main)] text-[9px] font-bold rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/activity" className="hover:text-[var(--accent-gold)] transition-colors text-[var(--text-secondary)]">
                    Cases ({totalCases})
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-3 border-b border-[var(--border-color)]">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Statistics</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 border border-[var(--border-color)] rounded-lg">
                    <p className="font-serif-heading text-xl text-[var(--text-primary)]">{stats.lostCount}</p>
                    <p className="text-[9px] uppercase text-[var(--text-secondary)]">Lost</p>
                  </div>
                  <div className="text-center p-2 border border-[var(--border-color)] rounded-lg">
                    <p className="font-serif-heading text-xl text-[var(--text-primary)]">{stats.foundCount}</p>
                    <p className="text-[9px] uppercase text-[var(--text-secondary)]">Found</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => router.push("/report")}
                  className="w-full py-2.5 px-4 border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold rounded-lg"
                >
                  File Report
                </button>
              </div>
            </>
          ) : (
            /* Collapsed View */
            <div className="flex-1 flex flex-col items-center py-4 gap-4">
              <Link href="/notifications" className="relative p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Notifications">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span>
                )}
              </Link>
              <Link href="/activity" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Activity">
                <span className="text-[9px] font-bold">{totalCases}</span>
              </Link>
              <button
                onClick={() => router.push("/report")}
                className="w-8 h-8 flex items-center justify-center border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors rounded-lg text-sm font-bold"
                title="File Report"
              >
                +
              </button>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Assistant Button - Always at bottom */}
          <div className="p-3 border-t border-[var(--border-color)]">
            <button
              onClick={() => setShowAssistant(true)}
              className={`w-full flex items-center gap-2 py-2.5 px-3 border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg ${
                collapsed ? "justify-center px-0" : ""
              }`}
              title="Ask Assistant"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {!collapsed && <span className="text-[10px] uppercase tracking-wider font-medium">Ask Assistant</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Assistant Popup */}
      {showAssistant && <AssistantPopup onClose={() => setShowAssistant(false)} />}
    </>
  );
}