import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider"; // Ensure this path is correct
import { ProfileProvider } from "@/context/ProfileContext"; // If you have this too

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThinkTank | Intelligence Arena",
  description: "Secure decryption and logic protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen`}>
        {/* 1. Wrap everything in AuthProvider first */}
        <AuthProvider>
          {/* 2. Wrap in ProfileProvider so points/lives work */}
          <ProfileProvider>
            <main>{children}</main>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}