"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import useStore from "@/lib/store";

export default function AuthPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      setUser(data.user);
      resetForm();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            accessToken: tokenResponse.access_token 
          }),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google login failed");

        setUser(data.user);
        router.push("/dashboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          
          <h1 className="font-serif-heading text-3xl font-normal">
            FoundIt
          </h1>
          
        </div>

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
              Register
            </button>
          </div>

          {/* Google Login - Always visible */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 border border-[var(--border-color)] hover:border-[var(--accent-gold)] bg-[var(--card-bg)] text-[var(--text-primary)] flex items-center justify-center space-x-3 transition-colors text-xs uppercase tracking-wider disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? "Connecting..." : authMode === "register" ? "Sign up with Google" : "Continue with Google"}</span>
          </button>

          {/* Register Notice */}
          {authMode === "register" && (
            <div className="p-4 border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 rounded-xs text-center space-y-2">
              <svg className="w-6 h-6 mx-auto text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-[var(--text-primary)] font-semibold">
                Email registration is currently unavailable
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Please use <strong className="text-[var(--text-primary)]">Google</strong> to create your account. 
                After signing up, you can set a password in your Profile Settings and use email login thereafter.
              </p>
            </div>
          )}

          {/* Divider - only for login */}
          {authMode === "login" && (
            <div className="flex items-center space-x-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span>or Email Credentials</span>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            </div>
          )}

          {/* Login Form */}
          {authMode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="member@domain.edu" className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]" />
              </div>

              {error && (
                <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--accent-green)] text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Processing..." : "Authorize & Enter"}
              </button>
            </form>
          )}

          {/* Register Info */}
          {authMode === "register" && (
            <div className="text-center space-y-3">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                How it works
              </p>
              <div className="space-y-2 text-left">
                <div className="flex gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Sign up using your <strong className="text-[var(--text-primary)]">Google account</strong> above</span>
                </div>
                <div className="flex gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Go to your <strong className="text-[var(--text-primary)]">Profile</strong> and set a password</span>
                </div>
                <div className="flex gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Use your <strong className="text-[var(--text-primary)]">email & password</strong> to sign in anytime</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}