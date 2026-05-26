import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Walk Agency",
  description: "The Walk Agency is a platform for booking models and beauticians for events and photoshoots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
