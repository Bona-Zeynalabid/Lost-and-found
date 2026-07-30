"use client";
import { useState } from "react";

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Intake & Reporting Form
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          File an official case report for missing or recovered articles.
        </p>
      </section>

      {submitted ? (
        <div className="glass-panel p-6 border-l-2 border-[var(--accent-gold)] text-xs space-y-2">
          <p className="font-serif-heading text-base font-semibold">
            Report Registered Successfully
          </p>
          <p className="text-[var(--text-secondary)]">
            Your entry has been cataloged under Case Verification Code #CS-2026.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-3 py-1.5 border border-[var(--border-color)] uppercase text-[10px] tracking-widest"
          >
            Submit Another Entry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4 rounded-sm">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Article Classification
            </label>
            <select className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]">
              <option value="lost" className="dark:bg-[var(--bg-main)]">Lost Article</option>
              <option value="found" className="dark:bg-[var(--bg-main)]">Found Article</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Item Designation / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leather Bound Notebook"
              className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Primary Location
            </label>
            <input
              type="text"
              required
              placeholder="Building name or landmark"
              className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Detailed Description
            </label>
            <textarea
              rows={4}
              required
              placeholder="State any distinguishing features or marks..."
              className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--accent-green)] text-white py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Submit Case File
          </button>
        </form>
      )}
    </div>
  );
}