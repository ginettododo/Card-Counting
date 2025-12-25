import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/layout/nav-bar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Blackjack Trainer Pro',
  description: 'Premium trainer for blackjack, card counting, and strategy mastery.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, 'bg-background')} suppressHydrationWarning>
      <body className="min-h-screen">
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
