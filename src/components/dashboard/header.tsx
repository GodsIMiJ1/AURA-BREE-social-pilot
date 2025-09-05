import { Home, Infinity, Link as LinkIcon, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { SidebarNav } from "./sidebar-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
           <Link href="/" className="flex items-center gap-2">
            <Infinity className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              The Consciousness Machine
            </h1>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Toggle Navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-2">
            <div className="px-4">
              <Link href="/" className="flex items-center gap-2">
                <Infinity className="mr-2 h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  The Consciousness Machine
                </h1>
              </Link>
            </div>
            <div className="mt-4">
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
           <span className="text-sm text-muted-foreground hidden md:inline pl-2">A GodsIMiJ AI Solutions Project</span>
        </div>
      </div>
    </header>
  );
}
