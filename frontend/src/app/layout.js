import "./globals.css";
import LayoutShell from "../components/LayoutShell";

export const metadata = {
  title: "FoundIt - Heritage Lost & Found Ledger",
  description: "Institutional lost and found community network.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}