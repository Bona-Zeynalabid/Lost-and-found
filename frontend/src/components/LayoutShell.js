"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Navigation from "./Navigation";
import RightSidebar from "./RightSidebar";
import QuickReportModal from "./QuickReportModal";
import MobileFab from "./MobileFab";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  
  // Check if user is currently on the intro/login landing page
  const isAuthPage = pathname === "/";

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("lost");

  const handleOpenReport = (type = "lost") => {
    setReportType(type);
    setReportModalOpen(true);
  };

  return (
    <>
      {/* Header is always visible */}
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-0">
        {/* Navigation - Hidden on Landing Page */}
        {!isAuthPage && <Navigation />}

        {/* Main Content Area - Expands full width when on Landing Page */}
        <main
          className={`flex-1 p-4 sm:p-8 ${
            !isAuthPage ? "max-w-3xl lg:mr-72" : "max-w-4xl mx-auto"
          }`}
        >
          {children}
        </main>

        {/* Right Sidebar - Hidden on Landing Page */}
        {!isAuthPage && <RightSidebar onOpenReport={handleOpenReport} />}
      </div>

      {/* Mobile Floating Action Button - Hidden on Landing Page */}
      {!isAuthPage && <MobileFab onOpenReport={handleOpenReport} />}

      {/* Quick Report Form Modal */}
      <QuickReportModal
        isOpen={reportModalOpen}
        initialType={reportType}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
}