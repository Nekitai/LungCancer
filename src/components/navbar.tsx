"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Github, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/prediction", label: "Prediksi" },
  { href: "/about", label: "Tentang Model" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.jpeg" alt="Logo Universitas Teknologi AKBA Makassar" width={48} height={48} className="rounded-full" priority />

          <div className="leading-tight">
            <h1 className="text-base font-bold text-primary">Lung Cancer</h1>

            <p className="text-xs text-muted-foreground">Universitas Teknologi AKBA Makassar</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary", pathname === link.href ? "text-primary" : "text-muted")}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="icon" asChild aria-label="Repositori GitHub">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Buka menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={cn("rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/5", pathname === link.href ? "text-primary" : "text-muted")}>
                    {link.label}
                  </Link>
                ))}
                <a href="https://github.com" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-primary/5">
                  <Github className="size-4" /> GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
