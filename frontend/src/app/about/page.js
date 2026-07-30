export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Institutional Charter
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Our mission as a high-trust civic utility platform.
        </p>
      </section>

      <div className="glass-panel p-6 rounded-xs space-y-4 leading-relaxed text-xs">
        <p>
          FoundIt operates as a institutional ledger designed to maintain trust, transparency, and high utility for community lost-and-found operations.
        </p>
        <h3 className="font-serif-heading text-sm font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          Core Principles
        </h3>
        <ul className="list-disc pl-4 space-y-2 text-[var(--text-secondary)]">
          <li>Uncompromising privacy protections for reported personal items.</li>
          <li>Systematic cataloging and algorithmic matching protocols.</li>
          <li>Civic accountability with immutable record-keeping practices.</li>
        </ul>
      </div>
    </div>
  );
}