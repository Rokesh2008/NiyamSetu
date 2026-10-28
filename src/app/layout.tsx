import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AppProvider } from '@/contexts/AppContext';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NiyamSetu — AICTE Application Preflight',
  description: 'Evidence-first AICTE application preflight validation.',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-paper text-ink antialiased" style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif" }}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
