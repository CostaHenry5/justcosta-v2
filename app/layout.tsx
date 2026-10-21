import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.justcosta.org"),
  title: "Costa Henry — Medical Personnel, Health Informatics & Digital Builder",
  description:
    "Medical Personnel in Dar es Salaam building digital health and community products — FastMed, NipeDili and more.",
  openGraph: {
    title: "Costa Henry — JustCosta",
    description:
      "Medical Personnel in Dar es Salaam building digital health and community products.",
    url: "https://www.justcosta.org",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6bd12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-canvas text-ink transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
