"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="space-y-12 py-4 sm:py-8">
    
      <section className="text-center space-y-4 max-w-2xl mx-auto px-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-gold)] border border-[var(--accent-gold)] px-3 py-1 inline-block">
          Established Civic Utility
        </span>

        <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal leading-tight">
          The Institutional Standard for Lost & Found Recovery
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
          FoundIt provides a structured, high-trust digital ledger for returning
          lost personal property within institutional communities.
        </p>

        <div className="pt-4">
          <button
            onClick={() => router.push("/auth")}
            className="px-8 py-3 bg-[var(--accent-green)] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-all font-semibold rounded-xs shadow-xs"
          >
            Get Started / Access Ledger
          </button>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-[var(--border-color)] py-8">
        <div className="p-4 space-y-2">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            I. Structured Registry
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every reported article is cataloged with strict case verification tags.
          </p>
        </div>

        <div className="p-4 space-y-2 sm:border-l sm:border-[var(--border-color)]">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            II. Privacy Assurance
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct messaging occurs strictly through authorized case numbers.
          </p>
        </div>

        <div className="p-4 space-y-2 sm:border-l sm:border-[var(--border-color)]">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            III. Rapid Match Network
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Algorithmic location cross-referencing to return property swiftly.
          </p>
        </div>
      </section>
    </div>
  );
}