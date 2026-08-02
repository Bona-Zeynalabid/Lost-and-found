"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const storeUser = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/items/stats", {
          credentials: "include",
        });
        if (statsRes.status === 401) {
          router.push("/");
          return;
        }
        const statsData = await statsRes.json();
        if (!statsRes.ok) throw new Error(statsData.error || "Failed to load stats");
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading member profile…
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

  if (!storeUser) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          You are not logged in.
        </p>
      </div>
    );
  }

  const joinYear = new Date(storeUser.joinDate).getFullYear();
  const initials = `${storeUser.firstName.charAt(0).toUpperCase()}${storeUser.lastName ? storeUser.lastName.charAt(0).toUpperCase() : ""}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Member Profile
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Manage your credentials and view your activity.
        </p>
      </section>

      {/* Profile card */}
      <div className="glass-panel p-6 rounded-xs space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center font-serif-heading font-bold text-xl">
            {initials || "?"}
          </div>
          <div>
            <h3 className="font-serif-heading text-lg font-semibold">
              {storeUser.firstName} {storeUser.lastName}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {storeUser.email}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
              Member since {joinYear}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-color)] text-center">
          <div className="p-3 border border-[var(--border-color)] rounded-xs">
            <p className="font-serif-heading text-xl">{stats.lostCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Lost</p>
          </div>
          <div className="p-3 border border-[var(--border-color)] rounded-xs">
            <p className="font-serif-heading text-xl">{stats.foundCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Found</p>
          </div>
          <div className="p-3 border border-[var(--border-color)] rounded-xs">
            <p className="font-serif-heading text-xl">{stats.resolvedCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Resolved</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-3 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs uppercase tracking-wider rounded-xs transition-colors"
      >
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10 border border-[var(--border-color)]">
            <h3 className="font-serif-heading text-lg font-semibold mb-2">Confirm Logout</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-[var(--border-color)] text-xs uppercase tracking-wider rounded-xs hover:bg-[var(--border-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs uppercase tracking-wider rounded-xs hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}