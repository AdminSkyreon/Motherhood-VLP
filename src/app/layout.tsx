import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Montserrat } from 'next/font/google';
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: "Motherhood VSL",
  description: "Motherhood Fertility & IVF Landing Page",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-base-path={process.env.NEXT_PUBLIC_BASE_PATH || ''}>
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}