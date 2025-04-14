import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PairingManager } from '@/components/pairing/PairingManager';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HeartSync - Shared Planner for Couples',
  description: 'A shared planner application for couples to manage their daily lives together.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <PairingManager />
              </div>
              <div className="lg:col-span-3">
                {children}
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
