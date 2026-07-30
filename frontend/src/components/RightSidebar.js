"use client";
import { useState } from "react";
import Link from "next/link";

export default function RightSidebar({ onOpenReport }) {
  const [collapsed, setCollapsed] = useState(false);

  // Mock user and application status data
  const userStatus = {
    name: "Julian Desk",
    memberId: "MEM-8902",
    unreadNotifications: 2,
    activeReports: 1,
    trustRating: "Verified Member",
  };

  const appStatus = {
    systemState: "Operational",
    ledgerRegistry: "Online (v2.4)",
    activeCasesToday: 14,
  };

  return (
    <aside
      className={`glass-panel fixed top-14 right-0 h-[calc(100vh-3.5rem)] p-3 border-l border-[var(--border-color)] z-20 transition-all duration-300 hidden lg:flex flex-col justify-between overflow-y-auto ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="space-y-6">
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full px-2 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-color)]"
          title={collapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {!collapsed && <span>System Status</span>}
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

        {/* Quick Report Actions */}
        <div className="space-y-2">
          {!collapsed ? (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenReport && onOpenReport("lost")}
                  className="py-2 px-1 border border-[var(--status-lost)] text-[var(--status-lost)] hover:bg-[var(--status-lost)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold text-center rounded-xs"
                >
                  + Lost
                </button>
                <button
                  onClick={() => onOpenReport && onOpenReport("found")}
                  className="py-2 px-1 border border-[var(--status-found)] text-[var(--status-found)] hover:bg-[var(--status-found)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold text-center rounded-xs"
                >
                  + Found
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2 pb-3 border-b border-[var(--border-color)]">
              <button
                onClick={() => onOpenReport && onOpenReport("lost")}
                className="w-8 h-8 flex items-center justify-center border border-[var(--status-lost)] text-[var(--status-lost)] hover:bg-[var(--status-lost)] hover:text-white transition-colors text-xs font-bold rounded-xs"
                title="File Lost Item"
              >
                -
              </button>
              <button
                onClick={() => onOpenReport && onOpenReport("found")}
                className="w-8 h-8 flex items-center justify-center border border-[var(--status-found)] text-[var(--status-found)] hover:bg-[var(--status-found)] hover:text-white transition-colors text-xs font-bold rounded-xs"
                title="File Found Item"
              >
                +
              </button>
            </div>
          )}
        </div>

        {!collapsed ? (
          /* Expanded View Content */
          <div className="space-y-6">
            {/* User Overview Section */}
            <section className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                User Record
              </p>
              
              <div className="p-3 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xs space-y-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-heading text-sm font-semibold">
                    {userStatus.name}
                  </h4>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--accent-gold)] font-medium">
                    {userStatus.trustRating}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  ID: {userStatus.memberId}
                </p>

                {/* Notifications & Active Reports Link */}
                <div className="pt-2 border-t border-[var(--border-color)] flex justify-between text-[11px]">
                  <Link
                    href="/notifications"
                    className="hover:text-[var(--accent-gold)] transition-colors flex items-center space-x-1"
                  >
                    <span>Alerts</span>
                    {userStatus.unreadNotifications > 0 && (
                      <span className="px-1.5 py-0.2 bg-[var(--accent-gold)] text-[var(--bg-main)] text-[9px] font-bold rounded-full">
                        {userStatus.unreadNotifications}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/activity"
                    className="hover:text-[var(--accent-gold)] transition-colors"
                  >
                    Active Cases ({userStatus.activeReports})
                  </Link>
                </div>
              </div>
            </section>

            {/* Application & System Health Section */}
            <section className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Registry Health
              </p>

              <div className="p-3 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xs space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Status</span>
                  <span className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>{appStatus.systemState}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Ledger</span>
                  <span>{appStatus.ledgerRegistry}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Today's Logs</span>
                  <span>{appStatus.activeCasesToday} entries</span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Collapsed View (Icons Only) */
          <div className="flex flex-col items-center space-y-6 pt-2">
            <Link
              href="/notifications"
              className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {userStatus.unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span>
              )}
            </Link>

            <div className="w-2 h-2 rounded-full bg-emerald-500" title="System Operational"></div>
          </div>
        )}
      </div>

      {/* Talk to Agent Button at Bottom */}
      <div className="pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => alert("Connecting to a live registry agent...")}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-3 border border-[var(--accent-gold)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)] hover:text-white transition-all rounded-xs text-[10px] uppercase tracking-widest font-semibold ${
            collapsed ? "px-0" : ""
          }`}
          title="Talk to Agent"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {!collapsed && <span>Talk to Agent</span>}
        </button>
      </div>
    </aside>
  );
}