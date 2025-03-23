import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Footer from './footer';
import { TRPCProvider } from '@/utils/trpc-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hyfit',
  description: 'Hyfit, your workout and calorie tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <TRPCProvider>
            <div className='absolute inset-0 -z-10 h-full w-full bg-secondary'>
              {children}
              <Footer />
            </div>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
