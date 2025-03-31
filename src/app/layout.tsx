import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Dock from "@/components/dock";

export const metadata: Metadata = {
  title: "Hyfit",
  description: "Hyfit : Your gym and diet tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="text-primary">
        <TRPCReactProvider>
          <div className="bg-background absolute inset-0 -z-10 h-full w-full">
            {children}
            <Dock />
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
