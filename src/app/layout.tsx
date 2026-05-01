import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base URL for resolving relative image/asset paths
  metadataBase: new URL("https://rapid-photo.vercel.app"),

  title: {
    default: "Rapid Photo | Official Passport and Visa Photos Generator",
    template: "%s | Rapid Photo",
  },
  description:
    "Generate official passport and visa photos instantly. Features AI face alignment, professional background removal, and 300 DPI print-ready layouts for 150+ countries. 100% privacy-focused.",
  applicationName: "Rapid Photo",

  // Author information
  authors: [
    { name: "MD HADI AL HAMZA", url: "https://hadialhamza.vercel.app" },
  ],
  creator: "MD HADI AL HAMZA",
  publisher: "MD HADI AL HAMZA",

  // Keywords for search engines
  keywords: [
    "passport photo generator",
    "visa photo maker",
    "ID photo creator",
    "remove background",
    "300 DPI photo",
    "AI face alignment",
    "print ready passport photo",
  ],

  // Open Graph configuration for Facebook, LinkedIn, Discord, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rapid-photo.vercel.app/",
    siteName: "Rapid Photo",
    title: "Rapid Photo | Official Passport and Visa Photos Generator",
    description:
      "Generate official passport and visa photos instantly with AI. Supports 150+ countries with 300 DPI print-ready quality.",
    images: [
      {
        url: "https://res.cloudinary.com/djmfhatti/image/upload/v1777665354/rapid-photo-home_y56mrh.png",
        width: 1200,
        height: 630,
        alt: "Rapid Photo - Homepage Preview",
      },
    ],
  },

  // Twitter Card configuration
  twitter: {
    card: "summary_large_image",
    title: "Rapid Photo | Official Passport and Visa Photos Generator",
    description:
      "Generate official passport and visa photos instantly with AI. Supports 150+ countries with 300 DPI print-ready quality.",
    images: [
      "https://res.cloudinary.com/djmfhatti/image/upload/v1777665354/rapid-photo-home_y56mrh.png",
    ],
  },

  // Favicon and Apple Touch icons
  icons: {
    icon: "https://res.cloudinary.com/djmfhatti/image/upload/v1777667018/Copy_of_Rapid_Photo_Logo_x75wht.png",
    apple:
      "https://res.cloudinary.com/djmfhatti/image/upload/v1777667018/Copy_of_Rapid_Photo_Logo_x75wht.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
