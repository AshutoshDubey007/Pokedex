
"use client";

import type { Pokemon } from "@/services/poke-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void; // Add onClick prop
}

// Function to get Tailwind background color class based on type
// (Using explicit Tailwind classes for now, could be moved to config/theme later)
const getTypeColorClass = (type: string): string => {
  switch (type.toLowerCase()) {
    case "fire": return "bg-red-500 hover:bg-red-600";
    case "water": return "bg-blue-500 hover:bg-blue-600";
    case "grass": return "bg-green-500 hover:bg-green-600";
    case "electric": return "bg-yellow-400 hover:bg-yellow-500";
    case "psychic": return "bg-pink-500 hover:bg-pink-600";
    case "ice": return "bg-cyan-300 hover:bg-cyan-400";
    case "dragon": return "bg-indigo-600 hover:bg-indigo-700";
    case "dark": return "bg-gray-700 hover:bg-gray-800";
    case "fairy": return "bg-pink-300 hover:bg-pink-400";
    case "normal": return "bg-gray-400 hover:bg-gray-500";
    case "fighting": return "bg-orange-700 hover:bg-orange-800";
    case "flying": return "bg-sky-400 hover:bg-sky-500";
    case "poison": return "bg-purple-600 hover:bg-purple-700";
    case "ground": return "bg-yellow-600 hover:bg-yellow-700";
    case "rock": return "bg-yellow-800 hover:bg-yellow-900";
    case "bug": return "bg-lime-500 hover:bg-lime-600";
    case "ghost": return "bg-indigo-800 hover:bg-indigo-900";
    case "steel": return "bg-gray-500 hover:bg-gray-600";
    default: return "bg-gray-400 hover:bg-gray-500";
  }
};

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(pokemon);
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-between overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer",
        onClick ? "group" : "" // Add group class if clickable for potential future styling
      )}
      onClick={handleClick}
      role={onClick ? "button" : undefined} // Add role if clickable
      tabIndex={onClick ? 0 : undefined} // Make focusable if clickable
      onKeyDown={(e) => { // Allow activation with Enter/Space
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault(); // Prevent page scroll on Space
          handleClick();
        }
      }}
    >
      <CardHeader className="p-4 items-center text-center w-full">
        <div className="w-24 h-24 relative mb-2">
          {pokemon.imageUrl ? (
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              layout="fill"
              objectFit="contain"
              priority={pokemon.id <= 20} // Prioritize loading images for the first few Pokemon
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              ?
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-semibold">{pokemon.name}</CardTitle>
        <p className="text-sm text-muted-foreground">#{pokemon.id}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 w-full flex justify-center space-x-2">
        {pokemon.types.map((type) => (
          <Badge
            key={type}
            className={cn(
              "text-xs font-semibold text-white transition-colors", // Add transition
              getTypeColorClass(type)
            )}
            variant="default" // Use default variant but override color with utility class
          >
            {type}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
