"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const storeUser = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const setUser = useStore((s) => s.setUser);
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Password change fields
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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
    // Clear user from store FIRST
    logout();
    // Then redirect
    router.replace("/");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setSuccess("Password updated successfully");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
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
  const hasPassword = !!storeUser.password;
  const isGoogleUser = !!storeUser.googleId;

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

      {/* Success message */}
      {success && (
        <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

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
              {isGoogleUser && " • Google Account"}
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

      {/* Password Section */}
      <div className="glass-panel p-6 rounded-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-base font-semibold">Password</h3>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
              {hasPassword ? "Change your password" : "Set a password to login with email"}
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-wider hover:border-[var(--accent-gold)] transition-colors"
          >
            {showPasswordForm ? "Cancel" : hasPassword ? "Change" : "Set Password"}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordUpdate} className="space-y-3 pt-3 border-t border-[var(--border-color)]">
            {hasPassword && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required={hasPassword}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            {passwordError && (
              <p className="text-xs text-red-600">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
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
            <h3 className="font-serif-heading text-lg font-semibold mb-2 text-[var(--text-primary)]">Confirm Logout</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] text-xs uppercase tracking-wider rounded-xs hover:bg-[var(--border-color)] transition-colors"
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