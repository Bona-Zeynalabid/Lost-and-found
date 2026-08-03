"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
import ItemCard from "@/components/ItemCard";

export default function NotificationsPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load notifications");
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PATCH",
        credentials: "include",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (notif) => {
    markAsRead(notif._id);
    if (notif.matchedItem) {
      setSelectedItem({
        ...notif.matchedItem,
        type: notif.matchedItemType,
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Please log in to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
            Notifications
          </h2>
          <p className="text-xs text-[var(--text-secondary)] tracking-wide">
            Match alerts and case updates
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider border border-[var(--border-color)] hover:border-[var(--accent-gold)] transition-colors"
          >
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading notifications…
        </p>
      ) : error ? (
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-3">{error}</p>
      ) : notifications.length === 0 ? (
        <div className="glass-panel p-8 text-center border border-dashed border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-secondary)]">
            No notifications yet. Matches will appear here when found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`glass-panel rounded-xs overflow-hidden transition-colors ${
                notif.isRead
                  ? "border border-[var(--border-color)]"
                  : "border-l-2 border-l-[var(--accent-gold)] border border-[var(--border-color)] bg-[var(--card-bg-hover)]"
              }`}
            >
              {/* Notification Header */}
              <div className="p-3 border-b border-[var(--border-color)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] flex-shrink-0"></span>
                    )}
                    <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider flex-shrink-0 ml-3">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Matched Item Card */}
              {notif.matchedItem && (
                <div
                  onClick={() => handleViewDetails(notif)}
                  className="p-3 cursor-pointer hover:bg-[var(--border-color)]/20 transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-2 font-semibold">
                    This {notif.matchedItemType} item may match your report — tap to view full details
                  </p>
                  <ItemCard
                    item={{
                      ...notif.matchedItem,
                      type: notif.matchedItemType,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Centered Popup Modal for Full Details */}
     {/* Centered Popup Modal for Full Details */}
{selectedItem && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={() => setSelectedItem(null)}
  >
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

    <div
      className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[var(--bg-main)] rounded-2xl shadow-2xl p-6 z-10 border border-[var(--border-color)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={() => setSelectedItem(null)}
        className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-3 h-3 rounded-full ${
            selectedItem.type === "lost" ? "bg-red-500" : "bg-green-500"
          }`}
        />
        <span
          className={`text-xs font-bold uppercase tracking-wide ${
            selectedItem.type === "lost"
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {selectedItem.type} Item
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] ml-auto border border-[var(--border-color)] px-2 py-0.5 rounded-full">
          {selectedItem.status}
        </span>
      </div>

      {/* Title & Category */}
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedItem.title}</h2>
      <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">
        {selectedItem.category}
      </p>

      <hr className="my-4 border-[var(--border-color)]" />

      {/* All Details */}
      <div className="space-y-3 text-sm">
        {selectedItem.description && (
          <div>
            <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              Description
            </span>
            <p className="mt-1 text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
              {selectedItem.description}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Address</span>
          <span className="text-[var(--text-primary)] text-right max-w-[60%]">
            {selectedItem.location?.address || "Not specified"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">City</span>
          <span className="text-[var(--text-primary)]">{selectedItem.location?.city || "Not specified"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Date</span>
          <span className="text-[var(--text-primary)]">
            {selectedItem.dateOccurred
              ? new Date(selectedItem.dateOccurred).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown"}
          </span>
        </div>

        <hr className="border-[var(--border-color)]" />
        <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          Contact Information
        </span>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Phone</span>
          <span className="text-[var(--text-primary)]">{selectedItem.contact?.phone || "Not provided"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Email</span>
          <span className="text-[var(--text-primary)]">{selectedItem.contact?.email || "Not provided"}</span>
        </div>

        {selectedItem.reward > 0 && (
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Reward</span>
            <span className="text-green-600 font-bold">${selectedItem.reward}</span>
          </div>
        )}

        {selectedItem.details && Object.keys(selectedItem.details).filter(k => selectedItem.details[k]).length > 0 && (
          <>
            <hr className="border-[var(--border-color)]" />
            <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              {selectedItem.category} Specifics
            </span>
            {Object.entries(selectedItem.details).map(([key, value]) => {
              if (!value || key === "otherDescription") return null;
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-[var(--text-secondary)] capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-[var(--text-primary)] text-right max-w-[60%]">{value}</span>
                </div>
              );
            })}
          </>
        )}

        {selectedItem.tags && selectedItem.tags.length > 0 && (
          <div>
            <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)]">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedItem.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-[var(--border-color)] text-[var(--text-primary)] text-[10px] uppercase tracking-wider rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

     
      <button
        onClick={() => setSelectedItem(null)}
        className="mt-6 w-full py-2.5 bg-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] rounded-xl text-sm font-medium transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}