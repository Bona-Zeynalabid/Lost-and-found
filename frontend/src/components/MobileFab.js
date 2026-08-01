"use client";

export default function MobileFab({ onOpenReport }) {
  return (
    <div className="fixed bottom-16 right-4 z-40 lg:hidden flex flex-col items-end space-y-2">
      <button
        onClick={() => onOpenReport && onOpenReport("lost")}
        className="glass-panel flex items-center space-x-2 px-4 py-3 border border-[var(--accent-gold)] bg-[var(--bg-main)] text-[var(--text-primary)] shadow-md hover:bg-[var(--accent-gold)] hover:text-white transition-all rounded-full active:scale-95"
        title="File Case Report"
      >
        <svg
          className="w-4 h-4 text-[var(--accent-gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-[10px] uppercase tracking-widest font-semibold">
          Report
        </span>
      </button>
    </div>
  );
}