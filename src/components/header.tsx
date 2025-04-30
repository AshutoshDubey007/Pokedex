"use client";

import { cn } from "@/lib/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Optional: Add a logo/icon later */}
          {/* <PokemonIcon className="h-6 w-6 text-primary" /> */}
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            PokeSearch
          </h1>
        </div>
        {/* Add navigation or other header elements here if needed */}
      </div>
    </header>
  );
}

// Placeholder for Pokemon Icon - Replace with actual SVG or Lucide icon if desired
// const PokemonIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
//   </svg>
// )
