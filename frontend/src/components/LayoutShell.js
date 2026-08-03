"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/lib/store";
import Header from "./Header";
import Navigation from "./Navigation";
import RightSidebar from "./RightSidebar";
import MobileFab from "./MobileFab";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Pages that don't require authentication
  const isPublicPage = pathname === "/" || pathname === "/auth";

  const initTheme = useStore((s) => s.initTheme);
  const fetchUser = useStore((s) => s.fetchUser);
  const user = useStore((s) => s.user);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
      setAuthChecked(true);
    };
    checkAuth();
  }, [fetchUser]);

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (authChecked && !user && !isPublicPage) {
      router.push("/");
    }
    // If user is logged in and on landing page, redirect to dashboard
    if (authChecked && user && pathname === "/") {
      router.push("/dashboard");
    }
  }, [authChecked, user, pathname, isPublicPage, router]);

  // Show nothing while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs text-[var(--text-secondary)]">Loading…</p>
      </div>
    );
  }

  // On public pages, show without navigation
  if (isPublicPage) {
    return (
      <>
        <Header />
        <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </>
    );
  }

  // On protected pages, show full layout with navigation
  return (
    <>
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 sm:pb-0">
        <Navigation />

        <main className="flex-1 p-4 sm:p-8 max-w-3xl lg:mr-72">
          {children}
        </main>

        <RightSidebar />
      </div>

      <MobileFab />
    </>
  );
}