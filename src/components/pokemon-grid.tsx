
"use client";

import type { Pokemon } from "@/services/poke-api";
import { PokemonCard } from "@/components/pokemon-card";
import { Skeleton } from "@/components/ui/skeleton";

interface PokemonGridProps {
  pokemonList: Pokemon[];
  isLoading: boolean;
  error: string | null;
  onPokemonClick?: (pokemon: Pokemon) => void; // Add click handler prop
}

export function PokemonGrid({
  pokemonList,
  isLoading,
  error,
  onPokemonClick, // Destructure the prop
}: PokemonGridProps) {
  if (error) {
    return (
      <div className="text-center text-destructive py-10">
        <p>Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (!pokemonList || pokemonList.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No Pokémon found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {pokemonList.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onClick={onPokemonClick} // Pass the click handler to the card
        />
      ))}
    </div>
  );
}
