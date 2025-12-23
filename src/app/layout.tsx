import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 1. GLOBAL STYLES (Order is critical for CSS override logic)
import "@/styles/global.css";      // 1st: System variables & Resets
import "@/styles/components.css";  // 2nd: Shared UI (Buttons, Cards, Tags)
import "@/styles/header.css";      // 3rd: Navigation logic
import "@/styles/footer.css";      // 4th: Footer manifest

// 2. CONTEXT & STATE
import { CartProvider } from "@/context/CartContext";

// 3. GLOBAL COMPONENTS
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Initialize the Inter font (Sharp, Technical, Modern)
const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-inter', 
});

export const metadata: Metadata = {
  title: "CMUK | ARCHIVE SYSTEM",
  description: "High-end 3D garment design, archive development, and manufacturing.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        {/* The CartProvider allows "Saving to Archive" from any page/component */}
        <CartProvider>
          
          {/* Persistent Branding & Navigation */}
          <Header />

          {/* Page Content Injection Point */}
          <main id="main-content" style={{ minHeight: '80vh' }}>
            {children}
          </main>

          {/* Persistent Footer & System Metadata */}
          <Footer />

          {/* Root element for Toast notifications/Popups */}
          <div id="toast-root" />
          
        </CartProvider>
      </body>
    </html>
  );
}