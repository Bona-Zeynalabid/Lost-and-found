"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntroAndAuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [showAuthSection, setShowAuthSection] = useState(false);

  // Directly navigate to dashboard on login or register
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleGoogleAuth = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-12 py-4 sm:py-8">
      {/* Hero / Introductory Section */}
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

      {/* Value Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-[var(--border-color)] py-8">
        <div className="p-4 space-y-2">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            I. Structured Registry
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every reported article is cataloged with strict case verification tags.
          </p>
        </div>

        <div className="p-4 space-y-2 sm:border-l sm:border-[var(--border-color)]">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            II. Privacy Assurance
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct messaging occurs strictly through authorized case numbers.
          </p>
        </div>

        <div className="p-4 space-y-2 sm:border-l sm:border-[var(--border-color)]">
          <span className="font-serif-heading text-sm font-semibold text-[var(--accent-gold)]">
            III. Rapid Match Network
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Algorithmic location cross-referencing to return property swiftly.
          </p>
        </div>
      </section>

      {/* Authentication Section */}
      {showAuthSection && (
        <section id="auth-panel" className="max-w-md mx-auto">
          <div className="glass-panel p-6 sm:p-8 border border-[var(--border-color)] bg-[var(--bg-main)] shadow-md space-y-6 rounded-xs">
            {/* Header Tabs */}
            <div className="flex border-b border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
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
                onClick={() => setAuthMode("register")}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  authMode === "register"
                    ? "border-b-2 border-[var(--accent-gold)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Register Record
              </button>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 border border-[var(--border-color)] hover:border-[var(--accent-gold)] bg-[var(--card-bg)] text-[var(--text-primary)] flex items-center justify-center space-x-3 transition-colors text-xs uppercase tracking-wider"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center space-x-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest my-4">
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span>or Email Credentials</span>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Desk"
                    className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
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
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              {/* Login Button direct redirect */}
              <button
                type="submit"
                className="w-full py-3 bg-[var(--accent-green)] text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity mt-2"
              >
                {authMode === "login" ? "Authorize & Enter" : "Complete Registration"}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}