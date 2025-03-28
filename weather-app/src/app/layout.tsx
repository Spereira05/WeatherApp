import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components";
import { ErrorBoundary } from '@/components/errorhandling'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather App - Get Real-Time Weather Updates",
  description: "A simple and easy-to-use weather app providing real-time weather information for cities around the world.",
  keywords: ["weather", "forecast", "real-time weather", "city weather"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Weather App",
    description: "Get real-time weather updates for cities around the world",
    url: "https://your-weather-app.vercel.app",
    siteName: "Weather App",
    images: [
      {
        url: "/og-image.jpg", // Add an OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}