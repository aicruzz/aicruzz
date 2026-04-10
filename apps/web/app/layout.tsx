import type { Metadata } from 'next';
import './globals.css';
import ClientProvider from './ClientProvider';

export const metadata: Metadata = {
  title: 'AiCruzz — AI Video Creation Platform',
  description: 'Create stunning AI videos in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}