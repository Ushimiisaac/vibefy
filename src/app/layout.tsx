import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Vibefy — Free Music for Everyone",
  description:
    "Stream millions of songs with every premium feature free: no ads, unlimited skips, offline downloads. Available on Android and iPhone.",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-512.png", apple: "/icons/icon-512.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vibefy",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
