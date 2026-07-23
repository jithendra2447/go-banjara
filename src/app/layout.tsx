import type { Metadata } from "next";
import Script from "next/script";
import { CartProvider } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AuthModal } from "@/components/AuthModal";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go Banjara — Lifestyle Fashion & Travel E-Commerce Store",
  description: "Immersive travel bookings and premium street fashion for outdoor seekers and city lifestylers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden" style={{ overflowX: 'hidden' }} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-brand-beige text-primary-dark flex flex-col font-sans overflow-x-hidden relative"
        suppressHydrationWarning
      >
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-[90px]">{children}</main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
          <CheckoutModal />
          <AuthModal />
        </CartProvider>
      </body>
    </html>
  );
}
