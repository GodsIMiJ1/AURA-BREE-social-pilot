
'use client'

import { BarChart2, Home, LayoutGrid, PenSquare, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const links = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/planning', label: 'Planning', icon: Puzzle },
  { href: '/content', label: 'Content', icon: PenSquare },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'default' }),
              'justify-start'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
