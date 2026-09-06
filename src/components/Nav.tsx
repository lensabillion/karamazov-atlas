'use client';

import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/read', label: 'Read' },
  { href: '/network', label: 'Network' },
  { href: '/map', label: 'Map' },
  { href: '/ask', label: 'Ask' },
];

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="nav">
      <span className="nav-brand">Karamazov Atlas</span>
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="nav-link"
          aria-current={isActive(l.href) ? 'page' : undefined}
        >
          {l.label}
        </a>
      ))}
      <span className="nav-spacer" />
      <span className="meta">Garnett · 96 chapters</span>
    </nav>
  );
}
