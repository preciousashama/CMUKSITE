import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 1. GLOBAL RESET & TOKENS (Import first)
import "../styles/global.css";

// 2. SHARED LAYOUT COMPONENTS
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/components.css"; // Toasts, Buttons, Placeholders

// 3. PAGE SPECIFIC (Optional: can be imported in specific pages instead)
// import "../styles/index.css"; 

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const metadata: Metadata = {
  title: "CMUK | ARCHIVE SYSTEM",
  description: "High-end 3D garment design and archive services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Header is global and appears on every page */}
        <header>
          {/* Header component logic will go here */}
        </header>

        <main>{children}</main>

        {/* The Footer is global and appears on every page */}
        <footer>
          {/* Footer component logic will go here */}
        </footer>

        {/* This is for the Toast notifications we styled in components.css */}
        <div id="toast-container" className="toast-container"></div>
      </body>
    </html>
  );
}