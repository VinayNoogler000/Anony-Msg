import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";

const inter = Inter({subsets:['latin']});

export const metadata: Metadata = {
  title: "AnonyMsg",
  description: "Real (Anonymous) Feedback from Real People",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
