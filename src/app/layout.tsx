import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const orbitron = localFont({
  src: "../fonts/Orbitron.ttf",
  variable: "--font-orbitron",
  display: "swap",
});
const inter = localFont({
  src: "../fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = localFont({
  src: "../fonts/JetBrainsMono.ttf",
  variable: "--font-jetbrains",
  display: "swap",
});

// Absolute site URL for canonical + social-card tags. Mirrors the deploy base
// path so the same value is correct in CI and (empty) local dev.
const SITE_URL =
  "https://nextgendev-ksk.github.io" + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
const OG_IMAGE = `${SITE_URL}/screenshots/home.png`;
const DESCRIPTION =
  "Veyra Sounds is a free, open source audio enhancer for Windows. Realtime EQ, spatial audio, voice cleanup and a gamer sound radar, all running system wide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Veyra Sounds | Hear Everything",
  description: DESCRIPTION,
  applicationName: "Veyra Sounds",
  keywords: [
    "Veyra Sounds",
    "Windows audio enhancer",
    "system-wide equalizer",
    "spatial audio",
    "APO",
    "microphone noise suppression",
    "open source",
    "GPLv3",
  ],
  authors: [{ name: "NextGenDev-KSK", url: "https://github.com/NextGenDev-KSK/veyra" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Veyra Sounds",
    title: "Veyra Sounds | Hear Everything",
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 675, alt: "The Veyra Sounds app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veyra Sounds | Hear Everything",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${orbitron.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
