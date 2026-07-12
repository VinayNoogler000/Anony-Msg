import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

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
          {children}  
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
