"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems: { href: string; name: string }[] = [
  { href: "/dashboard", name: "Dashboard" },
  { href: "/pricing", name: "Pricing" },
  { href: "/privacy", name: "Privacy Policy" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 px-4 z-50 w-full bg-background/95 backdrop-blur border-b">
      <div className="container flex items-center mx-auto h-16">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            LOGO
          </Link>
          <nav className="flex items-center space-x-7 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/60",
                  pathname === item.href && "text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
