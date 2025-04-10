import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components";
import { ErrorBoundary } from '@/components/errorhandling'
import Script from "next/script"

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
  authors: [{ name: "Backend developer" }],
  openGraph: {
    title: "Weather App",
    description: "Get real-time weather updates for cities around the world",
    url: "https://weather-app-nine-psi-58.vercel.app",
    siteName: "Weather App",
    images: [
      {
        url: "/og-image.jpg",
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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XG0LW1KL0K`}
          />
          <Script id="G-XG0LW1KL0K" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XG0LW1KL0K');
            `}
          </Script>
          <Providers> 
            { children } 
          </Providers>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}