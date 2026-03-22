import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AiCruzz — AI Video Creation Platform',
  description: 'Create stunning AI videos in seconds. Text-to-video, avatars, animations and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
