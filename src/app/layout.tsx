import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PairingManager } from '@/components/pairing/PairingManager';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from '@/components/mobile-nav';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HeartSync - Shared Planner for Couples',
  description: 'A shared planner application for couples to manage their daily lives together.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn(inter.className, "h-full antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                  <MobileNav />
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">❤️ HeartSync</span>
                  </Link>
                  <nav className="hidden md:flex gap-6">
                    <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/calendar" className="text-sm font-medium transition-colors hover:text-primary">
                      Calendar
                    </Link>
                    <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                      Chat
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                {/* Sidebar */}
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                  <div className="h-full py-6 pl-8 pr-6 lg:py-8">
                    <PairingManager />
                  </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex w-full flex-col overflow-hidden">
                  <div className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with ❤️ for couples who share more than just love
                </p>
                <div className="flex gap-4">
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Terms
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
