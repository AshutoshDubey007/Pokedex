
"use client";

import type { PokemonDetail } from "@/services/poke-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Import if needed for actions
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Import Progress
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Button } from "@/components/ui/button"; // Import Button for close

interface PokemonDetailModalProps {
  pokemonDetail: PokemonDetail | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

// Re-use or redefine type color logic if needed, ensure consistency
const getTypeColorClass = (type: string): string => {
  switch (type.toLowerCase()) {
    case "fire": return "bg-red-500";
    case "water": return "bg-blue-500";
    case "grass": return "bg-green-500";
    case "electric": return "bg-yellow-400";
    case "psychic": return "bg-pink-500";
    case "ice": return "bg-cyan-300";
    case "dragon": return "bg-indigo-600";
    case "dark": return "bg-gray-700";
    case "fairy": return "bg-pink-300";
    case "normal": return "bg-gray-400";
    case "fighting": return "bg-orange-700";
    case "flying": return "bg-sky-400";
    case "poison": return "bg-purple-600";
    case "ground": return "bg-yellow-600";
    case "rock": return "bg-yellow-800";
    case "bug": return "bg-lime-500";
    case "ghost": return "bg-indigo-800";
    case "steel": return "bg-gray-500";
    default: return "bg-gray-400";
  }
};

const MAX_STAT_VALUE = 255; // Maximum possible base stat value in Pokemon games

export function PokemonDetailModal({
  pokemonDetail,
  isLoading,
  isOpen,
  onClose,
}: PokemonDetailModalProps) {

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-4 p-4">
            <DialogHeader>
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/4 mx-auto" />
            </DialogHeader>
            <Skeleton className="h-32 w-32 mx-auto rounded-full" />
            <Skeleton className="h-6 w-1/2 mx-auto" /> {/* Types Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
               <Skeleton className="h-4 w-1/4" />
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
               ))}
            </div>
            <DialogFooter>
               <Skeleton className="h-10 w-20"/>
            </DialogFooter>
          </div>
        ) : pokemonDetail ? (
          // Content when loaded
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">{pokemonDetail.name}</DialogTitle>
              <DialogDescription>#{pokemonDetail.id}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-32 h-32 relative">
                {pokemonDetail.imageUrl ? (
                  <Image
                    src={pokemonDetail.imageUrl}
                    alt={pokemonDetail.name}
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    ?
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-2">
                {pokemonDetail.types.map((type) => (
                  <Badge
                    key={type}
                    className={cn("text-sm font-semibold text-white", getTypeColorClass(type))}
                    variant="default"
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              {/* Physical Attributes */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm w-full max-w-xs text-center">
                 <div className="font-medium text-muted-foreground">Height:</div>
                 <div>{(pokemonDetail.height / 10).toFixed(1)} m</div> {/* Convert dm to m */}
                 <div className="font-medium text-muted-foreground">Weight:</div>
                 <div>{(pokemonDetail.weight / 10).toFixed(1)} kg</div> {/* Convert hg to kg */}
              </div>

              {/* Abilities */}
              <div className="w-full px-2">
                <h3 className="text-lg font-semibold mb-2 text-center">Abilities</h3>
                <ul className="list-disc list-inside text-center space-y-1">
                  {pokemonDetail.abilities.map((ability) => (
                    <li key={ability}>{ability}</li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="w-full px-2">
                <h3 className="text-lg font-semibold mb-2 text-center">Base Stats</h3>
                <div className="space-y-2">
                  {pokemonDetail.stats.map((stat) => (
                    <div key={stat.name} className="grid grid-cols-5 items-center gap-2 text-sm">
                      <span className="font-medium text-muted-foreground col-span-1 text-right">{stat.name}:</span>
                      <Progress
                        value={(stat.value / MAX_STAT_VALUE) * 100} // Calculate percentage
                        className="h-3 col-span-3"
                        aria-label={`${stat.name} stat value`}
                      />
                      <span className="font-semibold col-span-1 text-left">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button type="button" variant="secondary" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Error or Not Found state
          <div className="text-center py-10">
            <p className="text-destructive">Could not load Pokémon details.</p>
             <DialogFooter className="sm:justify-center mt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
