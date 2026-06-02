import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://packyourbags.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PackYourBags",
    template: "%s · PackYourBags",
  },
  description:
    "Plan premium trips with one calm workspace for leave, visas, flights, and AI-generated itineraries.",
  openGraph: {
    title: "PackYourBags",
    description:
      "A premium travel planning SaaS for leave tracking, visa discovery, itinerary building, and AI concierge workflows.",
    url: siteUrl,
    siteName: "PackYourBags",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PackYourBags travel planner preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PackYourBags",
    description:
      "Plan better trips with leave tracking, visa insights, itinerary management, and an AI travel concierge.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

