"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/lib/store";

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  
  useEffect(() => {
    if (!user) return;

   
    fetch("http://localhost:5000/api/items/stats", { credentials: "include" })
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

   
    fetch("http://localhost:5000/api/notifications", { credentials: "include" })
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
    <aside
      className={`glass-panel fixed top-14 right-0 h-[calc(100vh-3.5rem)] p-3 border-l border-[var(--border-color)] z-20 transition-all duration-300 hidden lg:flex flex-col justify-between overflow-y-auto ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="space-y-6">
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full px-2 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-color)]"
          title={collapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {!collapsed && <span>Panel</span>}
          <svg
            className={`w-3.5 h-3.5 transform transition-transform ${
              collapsed ? "rotate-180 mx-auto" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <div className="space-y-2">
          {!collapsed ? (
            <button
              onClick={() => router.push("/report")}
              className="w-full py-2.5 px-4 border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold rounded-xs"
            >
              + File Report
            </button>
          ) : (
            <div className="flex flex-col items-center pb-3 border-b border-[var(--border-color)]">
              <button
                onClick={() => router.push("/report")}
                className="w-10 h-10 flex items-center justify-center border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors text-lg font-bold rounded-xs"
                title="File Report"
              >
                +
              </button>
            </div>
          )}
        </div>

        {!collapsed ? (
          <div className="space-y-6">
          
            <section className="space-y-3">
              <div className="p-3 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xs space-y-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-heading text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h4>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {user?.email}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)] flex justify-between text-[11px]">
                  <Link
                    href="/notifications"
                    className="hover:text-[var(--accent-gold)] transition-colors flex items-center space-x-1"
                  >
                    <span>Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[var(--accent-gold)] text-[var(--bg-main)] text-[9px] font-bold rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/myactivity"
                    className="hover:text-[var(--accent-gold)] transition-colors"
                  >
                    Cases ({totalCases})
                  </Link>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 border border-[var(--border-color)] rounded-xs">
                  <p className="font-serif-heading text-lg">{stats.lostCount}</p>
                  <p className="text-[9px] uppercase text-[var(--text-secondary)]">Lost</p>
                </div>
                <div className="p-2 border border-[var(--border-color)] rounded-xs">
                  <p className="font-serif-heading text-lg">{stats.foundCount}</p>
                  <p className="text-[9px] uppercase text-[var(--text-secondary)]">Found</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Collapsed View */
          <div className="flex flex-col items-center space-y-5 pt-2">
            <Link
              href="/notifications"
              className="relative p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span>
              )}
            </Link>

            <Link
              href="/activity"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Activity"
            >
              <span className="text-[9px] font-bold">{totalCases}</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}