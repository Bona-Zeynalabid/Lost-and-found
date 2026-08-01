"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntroAndAuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [showAuthSection, setShowAuthSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setError("");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      authMode === "login"
        ? { email, password }
        : { email, password, firstName, lastName };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include", // important for cookies
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success – redirect to dashboard
      resetForm();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google sign‑in not implemented yet – will be added later
  const handleGoogleAuth = () => {
    setError("Google authentication will be available soon.");
  };

  return (
    <div className="space-y-12 py-4 sm:py-8">
      {/* Hero Section – unchanged */}
      <section className="text-center space-y-4 max-w-2xl mx-auto px-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-gold)] border border-[var(--accent-gold)] px-3 py-1 inline-block">
          Established Civic Utility
        </span>

        <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal leading-tight">
          The Institutional Standard for Lost & Found Recovery
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
          FoundIt provides a structured, high-trust digital ledger for returning lost personal property within institutional communities.
        </p>

        {!showAuthSection && (
          <div className="pt-4">
            <button
              onClick={() => setShowAuthSection(true)}
              className="px-8 py-3 bg-[var(--accent-green)] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-all font-semibold rounded-xs shadow-xs"
            >
              Get Started / Access Ledger
            </button>
          </div>
        )}
      </section>

      {/* Value Pillars – unchanged */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-[var(--border-color)] py-8">
        {/* ... same as before ... */}
      </section>

      {/* Authentication Section */}
      {showAuthSection && (
        <section id="auth-panel" className="max-w-md mx-auto">
          <div className="glass-panel p-6 sm:p-8 border border-[var(--border-color)] bg-[var(--bg-main)] shadow-md space-y-6 rounded-xs">
            {/* Tabs */}
            <div className="flex border-b border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); resetForm(); }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  authMode === "login"
                    ? "border-b-2 border-[var(--accent-gold)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); resetForm(); }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  authMode === "register"
                    ? "border-b-2 border-[var(--accent-gold)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Register Record
              </button>
            </div>

            {/* Google login placeholder */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 border border-[var(--border-color)] hover:border-[var(--accent-gold)] bg-[var(--card-bg)] text-[var(--text-primary)] flex items-center justify-center space-x-3 transition-colors text-xs uppercase tracking-wider"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                {/* Google icon paths – unchanged */}
              </svg>
              <span>Continue with Google (coming soon)</span>
            </button>

            <div className="flex items-center space-x-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest my-4">
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span>or Email Credentials</span>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Last Name (optional)
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@domain.edu"
                  className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--accent-green)] text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity mt-2 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : authMode === "login"
                  ? "Authorize & Enter"
                  : "Complete Registration"}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}