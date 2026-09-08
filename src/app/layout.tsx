import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Karamazov Atlas',
  description:
    'A queryable atlas of Dostoyevsky’s The Brothers Karamazov, derived from the full text.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Two families only. Fraunces for language, DM Sans for interface —
            see docs/design-system.md §2. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400..600,0..100,0..1;1,9..144,400..600,0..100,0..1&family=DM+Sans:ital,opsz,wght@0,9..40,400..600;1,9..40,400..600&display=swap"
        />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
