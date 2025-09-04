import type { Metadata } from "next";
import { Geist, Geist_Mono, Spline_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UserDataProvider } from "@/context/UserDataContext";
import ReduxProvider from "@/components/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SplineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The White Eagles Academy",
  description: "The White Eagles Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${SplineSans.variable} antialiased`}
      >
        <ReduxProvider>
          <UserDataProvider>
            {children}
            <Toaster />
          </UserDataProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
