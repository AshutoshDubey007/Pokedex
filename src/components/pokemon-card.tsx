"use client";

import type { Pokemon } from "@/services/poke-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
}

// Function to get Tailwind background color class based on type
const getTypeColorClass = (type: string): string => {
  switch (type.toLowerCase()) {
    case "fire":
      return "bg-red-500";
    case "water":
      return "bg-blue-500";
    case "grass":
      return "bg-green-500";
    case "electric":
      return "bg-yellow-400";
    case "psychic":
      return "bg-pink-500";
    case "ice":
      return "bg-cyan-300";
    case "dragon":
      return "bg-indigo-600";
    case "dark":
      return "bg-gray-700";
    case "fairy":
      return "bg-pink-300";
    case "normal":
      return "bg-gray-400";
    case "fighting":
      return "bg-orange-700";
    case "flying":
      return "bg-sky-400";
    case "poison":
      return "bg-purple-600";
    case "ground":
      return "bg-yellow-600";
    case "rock":
      return "bg-yellow-800";
    case "bug":
      return "bg-lime-500";
    case "ghost":
      return "bg-indigo-800";
    case "steel":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Card className="flex flex-col items-center justify-between overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
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
              "text-xs font-semibold text-white",
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
