"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
import ItemCard from "@/components/ItemCard";
import ContentLoader from "@/components/ContentLoader";

const categories = [
  "All", "Phone", "Laptop", "ID", "Wallet", "Keys",
  "Bag", "Jewelry", "Clothing", "Pet", "Electronics", "Documents", "Other",
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/items?status=active`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) { router.push("/"); return; }
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

  useEffect(() => { fetchItems(); }, [typeFilter]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (categoryFilter !== "All") result = result.filter((item) => item.category === categoryFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const text = [
          item.title, item.description, item.category,
          item.location?.address, item.location?.city,
          item.details?.brand, item.details?.model,
          item.details?.fullName, item.details?.idNumber,
          item.details?.keyIdentifier, item.details?.color,
          item.details?.material, item.details?.species,
          item.details?.breed, item.details?.petName,
          item.details?.documentType, item.details?.nameOnDocument,
          item.details?.deviceType, item.details?.serialNumber,
          ...(item.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        return text.includes(query);
      });
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [items, categoryFilter, searchQuery]);

  const groupedItems = useMemo(() => {
    const groups = [];
    let i = 0;
    let useTwo = true;
    while (i < filteredItems.length) {
      if (useTwo && i + 1 < filteredItems.length) {
        groups.push({ type: "two", items: [filteredItems[i], filteredItems[i + 1]] });
        i += 2;
      } else {
        groups.push({ type: "one", items: [filteredItems[i]] });
        i += 1;
      }
      useTwo = !useTwo;
    }
    return groups;
  }, [filteredItems]);

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("All");
    setSearchQuery("");
  };

  const hasActiveFilters = typeFilter !== "all" || categoryFilter !== "All" || searchQuery.trim() !== "";

  if (loading) {
    return <ContentLoader />;
  } 
  
  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[var(--accent-gold)] rounded-lg transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex space-x-1">
            {["all", "lost", "found"].map((f) => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg border transition-colors ${
                  typeFilter === f
                    ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)]"
                    : "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]"
                }`}
              >{f}</button>
            ))}
          </div>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 text-xs uppercase tracking-wider bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] rounded-lg cursor-pointer">
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">Clear</button>
          )}

          <span className="text-xs text-[var(--text-secondary)] ml-auto">{filteredItems.length} items</span>
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>
      ) : error ? (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-lg">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-sm text-[var(--text-secondary)]">{hasActiveFilters ? "No items match." : "No items yet."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedItems.map((group, groupIdx) => (
            <div key={groupIdx} className={`grid ${group.type === "two" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
              {group.items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  horizontal={group.type === "one"}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Detail Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 z-10 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {selectedItem.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedItem.images.slice(0, 4).map((img, i) => (
                  <img key={i} src={img.url || img} alt="" className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-bold uppercase ${selectedItem.type === "lost" ? "text-red-600" : "text-green-600"}`}>{selectedItem.type}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{selectedItem.status}</span>
              {selectedItem.owner && <span className="text-xs text-[var(--accent-gold)] font-semibold">Your Item</span>}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedItem.category}</p>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <div className="space-y-3 text-sm">
              {selectedItem.description && (
                <div>
                  <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Description</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Address</span><span className="text-gray-900 dark:text-white">{selectedItem.location?.address || "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">City</span><span className="text-gray-900 dark:text-white">{selectedItem.location?.city || "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Date</span><span className="text-gray-900 dark:text-white">{selectedItem.dateOccurred ? new Date(selectedItem.dateOccurred).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}</span></div>

              <hr className="border-gray-200 dark:border-gray-700" />
              <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Contact</p>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Phone</span><span className="text-gray-900 dark:text-white">{selectedItem.contact?.phone || "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Email</span><span className="text-gray-900 dark:text-white">{selectedItem.contact?.email || "-"}</span></div>

              {selectedItem.reward > 0 && (
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Reward</span><span className="text-green-600 font-bold">${selectedItem.reward}</span></div>
              )}

              {selectedItem.details && Object.keys(selectedItem.details).filter(k => selectedItem.details[k]).length > 0 && (
                <>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{selectedItem.category} Details</p>
                  {Object.entries(selectedItem.details).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="text-gray-900 dark:text-white">{value}</span>
                      </div>
                    );
                  })}
                </>
              )}

              {selectedItem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedItem.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setSelectedItem(null)} className="mt-6 w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}