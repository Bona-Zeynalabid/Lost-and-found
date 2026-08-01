"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  // ... (mock data stays the same)

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
                  onClick={() => router.push("/report?type=lost")}
                  className="py-2 px-1 border border-[var(--status-lost)] text-[var(--status-lost)] hover:bg-[var(--status-lost)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold text-center rounded-xs"
                >
                  + Lost
                </button>
                <button
                  onClick={() => router.push("/report?type=found")}
                  className="py-2 px-1 border border-[var(--status-found)] text-[var(--status-found)] hover:bg-[var(--status-found)] hover:text-white transition-colors text-[10px] uppercase tracking-wider font-semibold text-center rounded-xs"
                >
                  + Found
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2 pb-3 border-b border-[var(--border-color)]">
              <button
                onClick={() => router.push("/report?type=lost")}
                className="w-8 h-8 flex items-center justify-center border border-[var(--status-lost)] text-[var(--status-lost)] hover:bg-[var(--status-lost)] hover:text-white transition-colors text-xs font-bold rounded-xs"
                title="File Lost Item"
              >
                -
              </button>
              <button
                onClick={() => router.push("/report?type=found")}
                className="w-8 h-8 flex items-center justify-center border border-[var(--status-found)] text-[var(--status-found)] hover:bg-[var(--status-found)] hover:text-white transition-colors text-xs font-bold rounded-xs"
                title="File Found Item"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Rest of the sidebar remains unchanged */}
        {/* ... (all other sections) ... */}
      </div>
    </aside>
  );
}