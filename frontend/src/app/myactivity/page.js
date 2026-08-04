"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
import ItemCard from "../../components/ItemCard";

export default function ActivityPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user's items
  const fetchMyItems = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items?status=active`, {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load items");

      // Only show my items
      setItems(data.myItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  // Delete item
  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) return;

    setDeletingId(itemId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      // Remove from local state
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Separate lost and found items
  const lostItems = items.filter((item) => item.type === "lost");
  const foundItems = items.filter((item) => item.type === "found");

  if (!user) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Please log in to view your activity.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading your records…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-3">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Lost Items Section */}
      <section>
        <h3 className="font-serif-heading text-lg font-semibold mb-3 text-[var(--status-lost)]">
          Lost Items ({lostItems.length})
        </h3>
        {lostItems.length === 0 ? (
          <div className="glass-panel p-6 text-center text-xs text-[var(--text-secondary)] border border-dashed border-[var(--border-color)]">
            No lost items reported yet.
          </div>
        ) : (
          <div className="space-y-3">
            {lostItems.map((item) => (
              <div key={item._id} className="relative group">
                <ItemCard item={item} />
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-[10px] uppercase tracking-wider text-red-600 border border-red-300 hover:bg-red-50 rounded-xs disabled:opacity-50"
                >
                  {deletingId === item._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Found Items Section */}
      <section>
        <h3 className="font-serif-heading text-lg font-semibold mb-3 text-[var(--status-found)]">
          Found Items ({foundItems.length})
        </h3>
        {foundItems.length === 0 ? (
          <div className="glass-panel p-6 text-center text-xs text-[var(--text-secondary)] border border-dashed border-[var(--border-color)]">
            No found items reported yet.
          </div>
        ) : (
          <div className="space-y-3">
            {foundItems.map((item) => (
              <div key={item._id} className="relative group">
                <ItemCard item={item} />
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-[10px] uppercase tracking-wider text-red-600 border border-red-300 hover:bg-red-50 rounded-xs disabled:opacity-50"
                >
                  {deletingId === item._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Total count */}
      <div className="text-center pt-4 border-t border-[var(--border-color)]">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          Total Items: {items.length} ({lostItems.length} lost, {foundItems.length} found)
        </p>
      </div>
    </div>
  );
}