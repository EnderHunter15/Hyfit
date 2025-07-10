import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Dock from "@/components/dock";
import { WorkoutProvider } from "@/context/workoutContext";

export const metadata: Metadata = {
  title: "Hyfit",
  description: "Hyfit: Your gym and diet tracker",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512x512.png", sizes: "512x512" },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body className="text-primary bg-background">
          <TRPCReactProvider>
            <WorkoutProvider>
              <div className="bg-background absolute inset-0 -z-10 h-full w-full">
                {children}
                <Dock />
              </div>
            </WorkoutProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
