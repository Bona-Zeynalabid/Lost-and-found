"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
import ItemCard from "@/components/ItemCard";

const categories = [
  "All",
  "Phone",
  "Laptop",
  "ID",
  "Wallet",
  "Keys",
  "Bag",
  "Jewelry",
  "Clothing",
  "Pet",
  "Electronics",
  "Documents",
  "Other",
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);

  // Data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Popup
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "http://localhost:5000/api/items?status=active";
      if (typeFilter !== "all") url += `&type=${typeFilter}`;

      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load items");

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
    fetchItems();
  }, [typeFilter]);

  // Apply client-side filters
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const searchableText = [
          item.title,
          item.description,
          item.category,
          item.location?.address,
          item.location?.city,
          item.details?.brand,
          item.details?.model,
          item.details?.fullName,
          item.details?.idNumber,
          item.details?.keyIdentifier,
          item.details?.color,
          item.details?.material,
          item.details?.species,
          item.details?.breed,
          item.details?.petName,
          item.details?.documentType,
          item.details?.nameOnDocument,
          item.details?.deviceType,
          item.details?.serialNumber,
          ...(item.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "reward-high":
        result.sort((a, b) => (b.reward || 0) - (a.reward || 0));
        break;
      case "reward-low":
        result.sort((a, b) => (a.reward || 0) - (b.reward || 0));
        break;
      default:
        break;
    }

    return result;
  }, [items, categoryFilter, searchQuery, sortBy]);

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("All");
    setSearchQuery("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    typeFilter !== "all" || categoryFilter !== "All" || searchQuery.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Dashboard
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Official catalog of lost and recovered property within the institution.
        </p>
      </section>

      {/* Search & Filters Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title, description, location, brand, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border-color)] text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex space-x-1">
            {["all", "lost", "found"].map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-xs border transition-colors ${
                  typeFilter === f
                    ? "border-[var(--accent-gold)] text-[var(--text-primary)] font-semibold bg-[var(--card-bg)]"
                    : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)] rounded-xs cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="dark:bg-gray-900">
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)] rounded-xs cursor-pointer"
          >
            <option value="newest" className="dark:bg-gray-900">Newest</option>
            <option value="oldest" className="dark:bg-gray-900">Oldest</option>
            <option value="reward-high" className="dark:bg-gray-900">Reward High</option>
            <option value="reward-low" className="dark:bg-gray-900">Reward Low</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-300 rounded-xs transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Result Count */}
          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider ml-auto">
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading records…
        </p>
      ) : error ? (
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-3">{error}</p>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-8 text-center border border-dashed border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-secondary)]">
            {hasActiveFilters
              ? "No items match your search criteria."
              : "No records found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      {/* Detail Popup Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 z-10 border border-[var(--border-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-3 h-3 rounded-full ${selectedItem.type === "lost" ? "bg-red-500" : "bg-green-500"}`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide ${selectedItem.type === "lost" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
              >
                {selectedItem.type} Item
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] ml-auto border border-[var(--border-color)] px-2 py-0.5 rounded-full">
                {selectedItem.status}
              </span>
              {selectedItem.owner && (
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] border border-[var(--accent-gold)] px-2 py-0.5 rounded-full">
                  Your Item
                </span>
              )}
            </div>

            {/* Title & Category */}
            <h2 className="text-xl font-bold leading-tight">{selectedItem.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{selectedItem.category}</p>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <div className="space-y-3 text-sm">
              {selectedItem.description && (
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</span>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Address</span>
                <span className="text-right max-w-[60%]">{selectedItem.location?.address || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">City</span>
                <span>{selectedItem.location?.city || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</span>
                <span>
                  {selectedItem.dateOccurred
                    ? new Date(selectedItem.dateOccurred).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "Unknown"}
                </span>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />
              <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</span>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Phone</span>
                <span>{selectedItem.contact?.phone || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span>{selectedItem.contact?.email || "Not provided"}</span>
              </div>

              {selectedItem.reward > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Reward</span>
                  <span className="text-green-600 font-bold">${selectedItem.reward}</span>
                </div>
              )}

              {selectedItem.details &&
                Object.keys(selectedItem.details).filter((k) => selectedItem.details[k]).length > 0 && (
                  <>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {selectedItem.category} Specifics
                    </span>
                    {Object.entries(selectedItem.details).map(([key, value]) => {
                      if (!value || key === "otherDescription") return null;
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-right max-w-[60%]">{value}</span>
                        </div>
                      );
                    })}
                  </>
                )}

              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedItem.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] uppercase tracking-wider rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-6 w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}