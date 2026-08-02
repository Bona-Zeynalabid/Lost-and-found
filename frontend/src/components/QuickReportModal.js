"use client";
import { useState } from "react";

export default function QuickReportModal({ isOpen, initialType = "lost", onClose }) {
  const [type, setType] = useState(initialType);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="glass-panel w-full max-w-md p-6 border border-[var(--border-color)] bg-[var(--bg-main)] shadow-lg space-y-4 rounded-xs">
        
        <div className="flex justify-between items-baseline border-b border-[var(--border-color)] pb-3">
          <h3 className="font-serif-heading text-lg font-normal">
            File Quick Case Report
          </h3>
          <button
            onClick={handleClose}
            className="text-xs uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
        </div>

        {submitted ? (
          <div className="space-y-3 py-4 text-center">
            <p className="font-serif-heading text-base">Case Registered</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Your report has been logged under reference #REF-2026.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-4 py-2 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Toggle Type */}
            <div className="flex space-x-2 border-b border-[var(--border-color)] pb-3">
              <button
                type="button"
                onClick={() => setType("lost")}
                className={`flex-1 py-1.5 text-xs uppercase tracking-wider border ${
                  type === "lost"
                    ? "border-[var(--status-lost)] text-[var(--status-lost)] font-semibold"
                    : "border-[var(--border-color)] text-[var(--text-secondary)]"
                }`}
              >
                Lost Article
              </button>
              <button
                type="button"
                onClick={() => setType("found")}
                className={`flex-1 py-1.5 text-xs uppercase tracking-wider border ${
                  type === "found"
                    ? "border-[var(--status-found)] text-[var(--status-found)] font-semibold"
                    : "border-[var(--border-color)] text-[var(--text-secondary)]"
                }`}
              >
                Found Article
              </button>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Item Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Silver Pocket Watch"
                className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. West Quadrangle"
                className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Brief Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Distinguishing marks, color, brand..."
                className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity mt-2"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}