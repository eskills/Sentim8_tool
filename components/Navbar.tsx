"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuthContext } from '@/components/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Sentim8 Logo" width={40} height={40} className="mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
              Sentim8
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <NavLink href="/pricing" active={pathname === '/pricing'}>Pricing</NavLink>
            <NavLink href="/about" active={pathname === '/about'}>About</NavLink>
            {user ? (
              <Button onClick={logout} variant="outline">Sign Out</Button>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link href={href} className={`text-sm font-medium transition-colors hover:text-primary ${active ? 'text-primary' : 'text-muted-foreground'}`}>
      {children}
    </Link>
  );
}