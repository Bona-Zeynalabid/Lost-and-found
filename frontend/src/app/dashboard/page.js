"use client";
import { useState } from "react";
import { mockItems } from "../../lib/mockdata";
import ItemCard from "../../components/ItemCard";

export default function DashboardPage() {
  const [filter, setFilter] = useState("all");

  const filteredItems = mockItems.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Public Records Ledger
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Official catalog of lost and recovered property within the institution.
        </p>
      </section>

    
      <div className="flex space-x-2">
        {["all", "lost", "found"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs uppercase tracking-wider rounded-xs border transition-colors ${
              filter === f
                ? "border-[var(--accent-gold)] text-[var(--text-primary)] font-semibold"
                : "border-[var(--border-color)] text-[var(--text-secondary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

    
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}