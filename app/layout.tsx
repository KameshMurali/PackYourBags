import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/session-provider";

const siteUrl = "https://packyourbags.tonewbeginning.com";

// Headlines: a characterful grotesque with optical sizing. Body: a clean, friendly sans.
// Serif italic is reserved for one-word accents inside headlines.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fff8ee",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PackYourBags",
    template: "%s · PackYourBags",
  },
  description:
    "Check which countries your passport opens up, turn an idea into a day-by-day itinerary with an AI concierge, and keep every plan in one place.",
  openGraph: {
    title: "PackYourBags",
    description:
      "Go somewhere. We'll handle the paperwork: visa rules for your passport, AI itineraries, and every plan in one place.",
    url: siteUrl,
    siteName: "PackYourBags",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PackYourBags",
    description:
      "Visa rules for your passport, AI-built itineraries, and every plan in one place.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

