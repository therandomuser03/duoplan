import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { Metadata, Viewport } from 'next';
import ErrorBoundary from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6366f1', // Indigo color matching our theme
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: {
    default: 'HeartSync - Connect with Your Partner',
    template: '%s | HeartSync',
  },
  description: 'A shared calendar and chat app for couples to stay connected and organized.',
  keywords: ['couples', 'calendar', 'chat', 'relationship', 'organization', 'shared calendar', 'couple app'],
  authors: [{ name: 'HeartSync Team' }],
  creator: 'HeartSync Team',
  publisher: 'HeartSync',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heartsync.app',
    title: 'HeartSync - Connect with Your Partner',
    description: 'A shared calendar and chat app for couples to stay connected and organized.',
    siteName: 'HeartSync',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HeartSync - Connect with Your Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeartSync - Connect with Your Partner',
    description: 'A shared calendar and chat app for couples to stay connected and organized.',
    images: ['/twitter-image.jpg'],
    creator: '@heartsync',
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
  alternates: {
    canonical: 'https://heartsync.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <ErrorBoundary>
          <div className="min-h-full">
            <Navbar />
            <main className="flex-1">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
