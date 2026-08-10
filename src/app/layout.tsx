import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Analytics } from "@vercel/analytics/next"

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

        <footer className="text-center p-4 md:p-6 bg-gray-900 text-white flex flex-col gap-4">
          <div>
            Made with ❤️ by
            <Link href="https://linktr.ee/vinay_tambey" target="_blank" className="inline border-b-2 border-gray-200"> Vinay Tambey </Link>
          </div>

          <Link href="https://vinay-tambey-portfolio.vercel.app/" target="_blank">
            <Button variant="secondary">Explore Vinay's Portfolio</Button>
          </Link>

          <p>© 2026 <Link href={'/'}>AnonyMsg</Link>. All rights reserved.</p>
        </footer>

        <Analytics/>
      </body>
    </html>
  );
}
