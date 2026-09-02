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
  const [policeItems, setPoliceItems] = useState([]);
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
      const [normalRes, policeRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items?status=active${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/police/public/items`),
      ]);

      let normalItems = [];
      if (normalRes.ok) {
        const data = await normalRes.json();
        normalItems = [
          ...(data.myItems || []).map((item) => ({ ...item, owner: true, isPolice: false })),
          ...(data.communityItems || []).map((item) => ({ ...item, owner: false, isPolice: false })),
        ];
      } else if (normalRes.status === 401) {
        router.push("/");
        return;
      }

      let policeItems = [];
      if (policeRes.ok) {
        const data = await policeRes.json();
        policeItems = (data.items || []).map((item) => ({
          ...item,
          isPolice: true,
          type: "found",           // police always found
          dateOccurred: item.dateFound, // ensure date field used for sorting/display
          reward: 0,
        }));
      }

      setItems(normalItems);
      setPoliceItems(policeItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [typeFilter]);

  // Merge normal and police items, then filter
  const filteredItems = useMemo(() => {
    let all = [...items, ...policeItems];

    if (categoryFilter !== "All") {
      all = all.filter((item) => item.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      all = all.filter((item) => {
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
          item.station?.name, item.station?.city,
          ...(item.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        return text.includes(query);
      });
    }

    all.sort((a, b) => {
      const dateA = new Date(a.dateOccurred || a.dateFound || a.createdAt);
      const dateB = new Date(b.dateOccurred || b.dateFound || b.createdAt);
      return dateB - dateA;
    });

    return all;
  }, [items, policeItems, categoryFilter, searchQuery]);

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
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[var(--bg-main)] rounded-2xl shadow-2xl p-6 z-10 border border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Police badge */}
            {selectedItem.isPolice && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white mb-2">
                Police Found Item
              </span>
            )}

            {/* Images */}
            {selectedItem.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedItem.images.slice(0, 4).map((img, i) => (
                  <img key={i} src={img.url || img} alt="" className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-bold uppercase ${selectedItem.type === "lost" ? "text-red-600" : "text-green-600"}`}>{selectedItem.type}</span>
              <span className="text-xs text-[var(--text-secondary)]">{selectedItem.status}</span>
              {selectedItem.owner && <span className="text-xs text-[var(--accent-gold)] font-semibold">Your Item</span>}
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedItem.title}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedItem.category}</p>

            {/* Police station details */}
            {selectedItem.isPolice && selectedItem.station && (
              <div className="mt-4 p-4 border border-[var(--border-color)] rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  {selectedItem.station.imageUrl && (
                    <img src={selectedItem.station.imageUrl} alt="Station" className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{selectedItem.station.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{selectedItem.station.city}</p>
                  </div>
                </div>
                {selectedItem.station.phone && (
                  <p className="text-xs text-[var(--text-secondary)]">📞 {selectedItem.station.phone}</p>
                )}
                {selectedItem.station.address && (
                  <p className="text-xs text-[var(--text-secondary)]">📍 {selectedItem.station.address}</p>
                )}
                {selectedItem.station.latitude && selectedItem.station.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedItem.station.latitude},${selectedItem.station.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline"
                  >
                    Open in Maps
                  </a>
                )}
              </div>
            )}

            <hr className="my-4 border-[var(--border-color)]" />

            <div className="space-y-3 text-sm">
              {selectedItem.description && (
                <div>
                  <p className="font-semibold text-[var(--text-secondary)] text-xs uppercase mb-1">Description</p>
                  <p className="text-[var(--text-primary)] leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Address</span><span className="text-[var(--text-primary)]">{selectedItem.location?.address || "-"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">City</span><span className="text-[var(--text-primary)]">{selectedItem.location?.city || "-"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Date</span><span className="text-[var(--text-primary)]">{selectedItem.dateOccurred ? new Date(selectedItem.dateOccurred).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}</span></div>

              <hr className="border-[var(--border-color)]" />
              <p className="font-semibold text-[var(--text-secondary)] text-xs uppercase">Contact</p>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Phone</span><span className="text-[var(--text-primary)]">{selectedItem.contact?.phone || "-"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Email</span><span className="text-[var(--text-primary)]">{selectedItem.contact?.email || "-"}</span></div>

              {selectedItem.reward > 0 && (
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Reward</span><span className="text-green-600 font-bold">${selectedItem.reward}</span></div>
              )}

              {selectedItem.details && Object.keys(selectedItem.details).filter(k => selectedItem.details[k]).length > 0 && (
                <>
                  <hr className="border-[var(--border-color)]" />
                  <p className="font-semibold text-[var(--text-secondary)] text-xs uppercase">{selectedItem.category} Details</p>
                  {Object.entries(selectedItem.details).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--text-secondary)] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="text-[var(--text-primary)]">{value}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <button onClick={() => setSelectedItem(null)} className="mt-6 w-full py-2.5 bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-sm hover:bg-[var(--border-strong)] transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}