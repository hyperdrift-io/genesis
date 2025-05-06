'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckSquare, Users, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Task Manager</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button
                variant={isActive('/') && pathname === '/' ? "default" : "ghost"}
                className="flex items-center gap-2"
                size="sm"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/tasks">
              <Button
                variant={isActive('/tasks') ? "default" : "ghost"}
                className="flex items-center gap-2"
                size="sm"
              >
                <CheckSquare className="h-4 w-4" />
                Tasks
              </Button>
            </Link>
            <Link href="/users">
              <Button
                variant={isActive('/users') ? "default" : "ghost"}
                className="flex items-center gap-2"
                size="sm"
              >
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-1">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 border-t">
          <Link href="/">
            <Button
              variant={isActive('/') && pathname === '/' ? "default" : "ghost"}
              className="w-full justify-start text-left"
              size="sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/tasks">
            <Button
              variant={isActive('/tasks') ? "default" : "ghost"}
              className="w-full justify-start text-left"
              size="sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Button>
          </Link>
          <Link href="/users">
            <Button
              variant={isActive('/users') ? "default" : "ghost"}
              className="w-full justify-start text-left"
              size="sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
