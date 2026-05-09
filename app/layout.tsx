import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens AI | AI Spend Audit",
  description: "Find avoidable AI tool spend and generate a shareable startup AI stack audit.",
  openGraph: {
    title: "SpendLens AI",
    description: "Instant AI spend audit for startup teams.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens AI",
    description: "Instant AI spend audit for startup teams."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
