import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Gamepad2, Gift, Ticket, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Reward Centre</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/" ? "text-primary" : "text-muted-foreground")}>
              Home
            </Link>
            <Link href="/claim" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/claim" ? "text-primary" : "text-muted-foreground")}>
              Claim Code
            </Link>
            <Link href="/rewards" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/rewards" ? "text-primary" : "text-muted-foreground")}>
              Rewards
            </Link>
            <Link href="/admin" className={cn("text-sm font-medium transition-colors hover:text-primary flex items-center gap-1", location === "/admin" ? "text-primary" : "text-muted-foreground")}>
              <ShieldAlert className="h-4 w-4" />
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-background/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Reward Centre. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
