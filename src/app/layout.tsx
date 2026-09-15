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
        {/* Two period revivals, no sans. Libre Caslon Display sets titles as the
            1912 edition sets them; EB Garamond carries text, italics and
            oldstyle figures. See docs/design-system.md. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=EB+Garamond:ital,wght@0,400..700;1,400..700&display=swap"
        />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
