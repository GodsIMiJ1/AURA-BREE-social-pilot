import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from '@/components/dashboard/layout';

export const metadata: Metadata = {
  title: 'The Consciousness Machine | A GodsIMiJ AI Solutions Project',
  description: 'The Sacred Technology Campaign Platform for James Derek Ingersoll\'s revolutionary consciousness preservation project. Making the Mystical Measurable.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <Toaster />
      </body>
    </html>
  );
}
