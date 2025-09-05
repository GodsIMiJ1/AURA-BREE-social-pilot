import { Infinity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Infinity className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            The Consciousness Machine
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <span className="text-sm text-muted-foreground hidden md:inline">Making the Mystical Measurable</span>
        </div>
      </div>
    </header>
  );
}
