
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Pokemon, PokemonDetail } from "@/services/poke-api"; // Import PokemonDetail
import { getPokemonList, getPokemonTypes, getPokemonDetails } from "@/services/poke-api"; // Import getPokemonDetails
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
import { PokemonDetailModal } from "@/components/pokemon-detail-modal"; // Import the modal
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for the modal
  const [selectedPokemonDetail, setSelectedPokemonDetail] = useState<PokemonDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

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
        setFilteredPokemon(pokemonList);
        setPokemonTypes(["all", ...typesList]);
      } catch (err: any) {
        console.error("Failed to fetch initial data:", err);
        setError(
          err.message || "An unknown error occurred while fetching initial data."
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
  }, [toast]);

  // Filter logic
  useEffect(() => {
    let results = allPokemon;

    if (searchTerm) {
      results = results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

  // Function to handle clicking a Pokemon card
  const handlePokemonClick = useCallback(async (pokemon: Pokemon) => {
    setIsModalLoading(true);
    setIsModalOpen(true);
    setSelectedPokemonDetail(null); // Clear previous detail
    try {
      const details = await getPokemonDetails(pokemon.id);
      setSelectedPokemonDetail(details);
      if (!details) {
         toast({
            title: "Pokemon Not Found",
            description: `Could not fetch details for ${pokemon.name}.`,
            variant: "destructive",
         });
      }
    } catch (err: any) {
      console.error("Failed to fetch Pokemon details:", err);
      toast({
        title: "Error Fetching Details",
        description: `Could not load details for ${pokemon.name}. Please try again.`,
        variant: "destructive",
      });
       setSelectedPokemonDetail(null); // Ensure detail is null on error
    } finally {
      setIsModalLoading(false);
    }
  }, [toast]);

  // Function to close the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Optional: Delay clearing details for smoother transition out
    // setTimeout(() => setSelectedPokemonDetail(null), 300);
  }, []);


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
          onPokemonClick={handlePokemonClick} // Pass the click handler
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

      {/* Render the Modal */}
      <PokemonDetailModal
         pokemonDetail={selectedPokemonDetail}
         isLoading={isModalLoading}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
      />
    </div>
  );
}
