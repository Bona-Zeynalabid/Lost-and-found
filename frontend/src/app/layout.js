import "./globals.css";
import LayoutShell from "../components/LayoutShell";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "FoundIt - Heritage Lost & Found Ledger",
  description: "Institutional lost and found community network.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <LayoutShell>{children}</LayoutShell>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}