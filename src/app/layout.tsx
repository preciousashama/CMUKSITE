import { Inter } from "next/font/google";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Using relative paths to ensure the compiler finds your styles folder
import "../styles/global.css";
import "../styles/header.css";
import "../styles/footer.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "CMUK | ARCHIVE SYSTEM",
  description: "Digital Manufacturing and Garment Archiving Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body 
        style={{ 
          margin: 0, 
          padding: 0, 
          backgroundColor: '#ffffff',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        <CartProvider>
          <div className="app-container" style={styles.layout}>
            <Header />
            
            <main style={styles.mainContent}>
              {children}
            </main>

            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

// Basic structural styles to prevent layout shift before CSS loads
const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flex: '1 0 auto', // Pushes footer to bottom
    width: '100%',
  }
};