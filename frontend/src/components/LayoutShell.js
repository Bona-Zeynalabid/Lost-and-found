"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/lib/store";
import Header from "./Header";
import Navigation from "./Navigation";
import RightSidebar from "./RightSidebar";
import QuickReportModal from "./QuickReportModal";
import MobileFab from "./MobileFab";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/";

  const initTheme = useStore((s) => s.initTheme);
  const fetchUser = useStore((s) => s.fetchUser);
  const user = useStore((s) => s.user);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("lost");
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
    if (authChecked && !user && !isAuthPage) {
      router.push("/");
    }
  }, [authChecked, user, isAuthPage, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs text-[var(--text-secondary)]">Loading…</p>
      </div>
    );
  }

  const handleOpenReport = (type = "lost") => {
    setReportType(type);
    setReportModalOpen(true);
  };

  return (
    <>
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-0">
        {!isAuthPage && user && <Navigation />}

        <main
          className={`flex-1 p-4 sm:p-8 ${
            !isAuthPage && user ? "max-w-3xl lg:mr-72" : "max-w-4xl mx-auto"
          }`}
        >
          {children}
        </main>

        {!isAuthPage && user && <RightSidebar />}
      </div>

      {!isAuthPage && user && <MobileFab />}

      <QuickReportModal
        isOpen={reportModalOpen}
        initialType={reportType}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
}