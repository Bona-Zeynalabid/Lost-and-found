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

  // Define page types
  const isAuthPage = pathname === "/" || pathname === "/auth";
  const isPolicePage = pathname === "/police";
  const isPublicPage = isAuthPage || isPolicePage;

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

  useEffect(() => {
    // Redirect unauthenticated users from protected pages
    if (authChecked && !user && !isPublicPage) {
      router.push("/");
    }
    // Redirect authenticated users away from landing/auth pages (but NOT police page)
    if (authChecked && user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [authChecked, user, pathname, isPublicPage, isAuthPage, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  // Police page: render standalone (no normal header/nav)
  if (isPolicePage) {
    return <>{children}</>;
  }

  // Auth pages for unauthenticated users
  if (isAuthPage) {
    return (
      <>
        <Header />
        <main className="flex-1 p-3 sm:p-8 pb-24 sm:pb-8 min-w-0 max-w-full overflow-x-hidden">
          {children}
        </main>
      </>
    );
  }

  // Protected pages for authenticated users
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