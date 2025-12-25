'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/table', label: 'Tavolo' },
  { href: '/drills', label: 'Drill' },
  { href: '/settings', label: 'Impostazioni' },
  { href: '/stats', label: 'Statistiche' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          Blackjack Trainer Pro
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-3 py-2 text-sm transition-colors',
                pathname === link.href ? 'bg-surface text-text' : 'text-muted hover:text-text'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/drills">Drill veloce</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
