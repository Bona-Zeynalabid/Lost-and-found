"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ItemCard from "../../components/ItemCard";

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async (typeFilter) => {
    setLoading(true);
    setError("");
    try {
      let url = "http://localhost:5000/api/items?status=active";
      if (typeFilter !== "all") url += `&type=${typeFilter}`;

      const res = await fetch(url, {
        credentials: "include", // send the httpOnly cookie
      });

      if (res.status === 401) {
        router.push("/"); // redirect to auth page
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load items");

      // Combine myItems and communityItems into a single list
      const allItems = [
        ...(data.myItems || []).map((item) => ({ ...item, owner: true })),
        ...(data.communityItems || []).map((item) => ({ ...item, owner: false })),
      ];
      setItems(allItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Public Records Ledger
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Official catalog of lost and recovered property within the institution.
        </p>
      </section>

      {/* Filter buttons */}
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

      {/* Content */}
      {loading ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading records…
        </p>
      ) : error ? (
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-3">
          {error}
        </p>
      ) : items.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          No records found for this filter.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}