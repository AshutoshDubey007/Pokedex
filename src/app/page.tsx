"use client";

import { useState, useEffect, useMemo } from "react";
import type { Pokemon } from "@/services/poke-api";
import { getPokemonList, getPokemonTypes } from "@/services/poke-api";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PokemonGrid } from "@/components/pokemon-grid";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all"); // Default to "all"
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch initial data (Pokemon list and types)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [pokemonList, typesList] = await Promise.all([
          getPokemonList(),
          getPokemonTypes(),
        ]);
        setAllPokemon(pokemonList);
        setFilteredPokemon(pokemonList); // Initially show all
        setPokemonTypes(["all", ...typesList]); // Add "all" option
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(
          err.message || "An unknown error occurred while fetching data."
        );
        toast({
          title: "Error Fetching Data",
          description:
            err.message || "Could not load Pokémon data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]); // Add toast dependency

  // Filter logic - useMemo for optimization
  useEffect(() => {
    let results = allPokemon;

    // Filter by search term (case-insensitive)
    if (searchTerm) {
      results = results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected type
    if (selectedType !== "all") {
      results = results.filter((pokemon) =>
        pokemon.types.some(
          (type) => type.toLowerCase() === selectedType.toLowerCase()
        )
      );
    }

    setFilteredPokemon(results);
  }, [searchTerm, selectedType, allPokemon]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow sm:max-w-xs"
            aria-label="Search Pokémon by name"
          />
          <Select
            value={selectedType}
            onValueChange={handleTypeChange}
            disabled={isLoading || !!error}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter Pokémon by type">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              {pokemonTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PokemonGrid
          pokemonList={filteredPokemon}
          isLoading={isLoading}
          error={error}
        />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Data fetched from{" "}
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          PokeAPI
        </a>
        . App built with Next.js and Shadcn/ui.
      </footer>
    </div>
  );
}
