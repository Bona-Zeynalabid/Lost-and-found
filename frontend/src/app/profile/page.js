"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user info
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (userRes.status === 401) {
          router.push("/");
          return;
        }
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.error || "Failed to load profile");
        setUser(userData.user);

        // Fetch stats
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

  if (!user) {
    return (
      <div className="space-y-6">
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          You are not logged in.
        </p>
      </div>
    );
  }

  // Format join date
  const joinYear = new Date(user.joinDate).getFullYear();
  const initials = `${user.firstName.charAt(0).toUpperCase()}${user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}`;

  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Member Profile & Settings
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Manage your credentials and ledger notification preferences.
        </p>
      </section>

      {/* Profile card */}
      <div className="glass-panel p-6 rounded-xs space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-[var(--accent-gold)] flex items-center justify-center font-serif-heading font-bold text-lg">
            {initials || "?"}
          </div>
          <div>
            <h3 className="font-serif-heading text-lg font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              Registry Member since {joinYear}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-color)] text-center">
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">{stats.lostCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Lost</p>
          </div>
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">{stats.foundCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Found</p>
          </div>
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">{stats.resolvedCount}</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}