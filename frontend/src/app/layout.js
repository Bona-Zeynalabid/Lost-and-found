import "./globals.css";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import RightSidebar from "../components/RightSidebar";

export const metadata = {
  title: "FoundIt - Heritage Lost & Found Ledger",
  description: "Institutional lost and found community network.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 sm:pb-0">
          {/* Left Side Navigation */}
          <Navigation />

          {/* Main Workspace Area */}
          <main className="flex-1 p-4 sm:p-8 max-w-3xl lg:mr-72">{children}</main>

          {/* Right Status Sidebar */}
          <RightSidebar />
        </div>
      </body>
    </html>
  );
}