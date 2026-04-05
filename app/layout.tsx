import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  title: "AuraHR | AI-Powered Recruitment Ecosystem",
  description: "Experience the future of hiring with next-gen AI sourcing, JD parsing, and proctored assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="font-sans min-h-screen bg-[#121212] text-[#f5f5f7]">
        {/* Global Aurora Background */}
        <div className="aura-container">
          <div className="aura-blob w-[500px] h-[500px] -top-24 -left-24" />
          <div className="aura-blob w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="aura-blob w-[600px] h-[600px] -bottom-24 -right-24" />
        </div>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
