"use client";
import { mockItems } from "../../lib/mockdata";
import ItemCard from "../../components/ItemCard";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Personal Dossier & Activity
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Archive of case files and items submitted under your record.
        </p>
      </section>

      <div className="space-y-4">
        {mockItems.slice(0, 2).map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}