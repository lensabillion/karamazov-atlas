import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { chapterPlaces } from '@/lib/corpus';
import { GATE_SCRIPT } from '@/lib/reading-position';
import './globals.css';

export const metadata: Metadata = {
  title: 'Karamazov Atlas',
  description:
    'A queryable atlas of Dostoyevsky’s The Brothers Karamazov, derived from the full text.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the gate script below may set data-position on
    // <html> before React hydrates. The DOM is right; see lib/reading-position.ts.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before the body is parsed, so later chapters never paint. */}
        <script dangerouslySetInnerHTML={{ __html: GATE_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* One family, as a 1912 trade book uses one family. Old Standard TT
            revives the Modern (classicist) serif identified on the actual
            page — see docs/typeface-identification.md. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap"
        />
      </head>
      <body>
        <Nav places={chapterPlaces()} />
        {children}
      </body>
    </html>
  );
}
