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
    <html lang="en" className="scroll-smooth overflow-x-clip" style={{ overflowX: 'clip' }} suppressHydrationWarning>
      <head>
        {/* Preconnect to external image & font CDNs for high-speed page load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* High priority preloads for instant 0s video & poster rendering */}
        <link rel="preload" href="/hero-poster.jpg" as="image" fetchPriority="high" />
        <link rel="preload" href="/hero-video.mp4" as="video" type="video/mp4" />
      </head>
      <body
        className="antialiased min-h-screen bg-brand-beige text-primary-dark flex flex-col font-sans overflow-x-clip relative"
        suppressHydrationWarning
      >
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
