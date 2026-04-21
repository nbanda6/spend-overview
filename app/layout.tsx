import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Ios17DeviceFrame } from "@/app/components/ios-17-device-frame";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iMobile — Spend Overview (prototype)",
  description: "ICICI iMobile–style Spend Overview mobile prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-dvh antialiased">
        <Ios17DeviceFrame>{children}</Ios17DeviceFrame>
      </body>
    </html>
  );
}
