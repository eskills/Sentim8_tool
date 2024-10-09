import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthProvider';
import Toast from "@/components/Toast"
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sentim8 - Customer Sentiment Analysis',
  description: 'Analyze customer sentiment to drive product improvements and enhance customer satisfaction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toast />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}