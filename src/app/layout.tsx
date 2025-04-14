import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata = {
  title: 'HeartSync',
  icons: {
    icon: '/favicon.ico', // Path to your favicon file in the public folder
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
