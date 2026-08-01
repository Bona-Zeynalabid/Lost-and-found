"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useStore from "@/lib/store";
import Header from "./Header";
import Navigation from "./Navigation";
import RightSidebar from "./RightSidebar";
import QuickReportModal from "./QuickReportModal";
import MobileFab from "./MobileFab";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("lost");

 
  const initTheme = useStore((s) => s.initTheme);
  const fetchUser = useStore((s) => s.fetchUser);
  const user = useStore((s) => s.user);

  
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const handleOpenReport = (type = "lost") => {
    setReportType(type);
    setReportModalOpen(true);
  };

  return (
    <>
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-0">
        {!isAuthPage && <Navigation />}

        <main
          className={`flex-1 p-4 sm:p-8 ${
            !isAuthPage ? "max-w-3xl lg:mr-72" : "max-w-4xl mx-auto"
          }`}
        >
          {children}
        </main>

        {!isAuthPage && <RightSidebar onOpenReport={handleOpenReport} />}
      </div>

      {!isAuthPage && <MobileFab onOpenReport={handleOpenReport} />}

      <QuickReportModal
        isOpen={reportModalOpen}
        initialType={reportType}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
}