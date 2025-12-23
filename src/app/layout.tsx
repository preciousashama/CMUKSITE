import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 1. STYLE IMPORTS (Hierarchy is critical)
import "@/styles/global.css";      // System Tokens & Resets
import "@/styles/components.css";  // Shared UI (Buttons, Cards)
import "@/styles/header.css";      // Navigation System
import "@/styles/footer.css";      // Global Footer

// 2. CONTEXT PROVIDERS
import { CartProvider } from "@/context/CartContext";

// 3. COMPONENTS
import Header from "@/components/Header";
// import Footer from "@/components/Footer"; // Uncomment once Footer.tsx is created

// Initialize the Inter font (Modern, Technical, Sharp)
const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-inter', // Allows us to use it in CSS variables
});

export const metadata: Metadata = {
  title: "CMUK | ARCHIVE SYSTEM",
  description: "High-end 3D garment design, archive, and manufacturing services.",
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
        {/* Wrapping the entire app in CartProvider allows every page to access the collection */}
        <CartProvider>
          
          {/* Header is global - consistent brand handshake */}
          <Header />

          {/* Main content area */}
          <main id="main-content">
            {children}
          </main>

          {/* Global Footer */}
          {/* <Footer /> */}

          {/* Toast Container for system notifications (Success/Error) */}
          <div id="toast-root" className="toast-container" />
          
        </CartProvider>
      </body>
    </html>
  );
}