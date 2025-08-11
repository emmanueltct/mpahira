import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/components/ReactQueryProvider"; // 👈 import here
import "./globals.css";
import LogoutListener from "@/components/LogoutListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Welcome to our professional e-commerce platform!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiase text-gray-900">
       
        <ReactQueryProvider>
          <AuthProvider>
             <LogoutListener />
            <NavBar />
            <main className="min-h-screen mx-auto max-w-full">
              {children}
            </main>
            <Toaster position="top-right" reverseOrder={false} />
          </AuthProvider>
        </ReactQueryProvider>
 
      </body>
    </html>
  );
}
