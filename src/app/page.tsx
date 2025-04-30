
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
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { generatePokemonDescription } from "@/ai/flows/generate-pokemon-description-flow"; // Import the flow

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for the detail modal
  const [selectedPokemonDetail, setSelectedPokemonDetail] = useState<PokemonDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDetailModalLoading, setIsDetailModalLoading] = useState<boolean>(false);

  // State for AI description modal
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState<boolean>(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [pokemonDescription, setPokemonDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);


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
      // Filter based on the types fetched initially
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
    setIsDetailModalLoading(true);
    setIsDetailModalOpen(true);
    setSelectedPokemonDetail(null); // Clear previous detail
    try {
      // Use the full pokemon.id (number) for fetching details
      const details = await getPokemonDetails(pokemon.id);
       if (!details) {
         toast({
            title: "Pokemon Not Found",
            description: `Could not fetch details for ${pokemon.name}.`,
            variant: "destructive",
         });
         setIsDetailModalOpen(false); // Close modal if not found
         return;
      }
      setSelectedPokemonDetail(details);

    } catch (err: any) {
      console.error("Failed to fetch Pokemon details:", err);
      toast({
        title: "Error Fetching Details",
        description: `Could not load details for ${pokemon.name}. Please try again.`,
        variant: "destructive",
      });
       setSelectedPokemonDetail(null); // Ensure detail is null on error
       setIsDetailModalOpen(false); // Close modal on error
    } finally {
      setIsDetailModalLoading(false);
    }
  }, [toast]);

  // Function to close the detail modal
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    // Optional: Delay clearing details for smoother transition out
    // setTimeout(() => setSelectedPokemonDetail(null), 300);
  }, []);

   // Function to open AI description modal
  const handleGenerateDescriptionClick = useCallback(() => {
    if (!selectedPokemonDetail) return;

    setIsDescriptionModalOpen(true);
    setIsDescriptionLoading(true);
    setPokemonDescription("");
    setDescriptionError(null);


    generatePokemonDescription({ pokemonName: selectedPokemonDetail.name })
      .then((output) => {
        setPokemonDescription(output.description);
      })
      .catch((err: any) => {
        console.error("Failed to generate Pokémon description:", err);
        setDescriptionError("Could not generate description. The AI might be busy, please try again.");
        toast({
          title: "AI Error",
          description: "Failed to generate description.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsDescriptionLoading(false);
      });
  }, [selectedPokemonDetail, toast]);

  // Function to close AI description modal
  const handleCloseDescriptionModal = useCallback(() => {
    setIsDescriptionModalOpen(false);
    setPokemonDescription("");
    setDescriptionError(null);
  }, []);


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8 flex flex-col items-center"> {/* Added flex flex-col items-center */}
        {/* Centered the search/filter controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"> {/* Added w-full max-w-md */}
          <Input
            type="search"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:flex-1" // Adjusted width for responsiveness
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

        {/* Make PokemonGrid take full width available */}
        <div className="w-full">
            <PokemonGrid
              pokemonList={filteredPokemon}
              isLoading={isLoading}
              error={error}
              onPokemonClick={handlePokemonClick} // Pass the click handler
            />
        </div>
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

      {/* Render the Detail Modal */}
      <PokemonDetailModal
         pokemonDetail={selectedPokemonDetail}
         isLoading={isDetailModalLoading}
         isOpen={isDetailModalOpen}
         onClose={handleCloseDetailModal}
         onGenerateDescription={handleGenerateDescriptionClick} // Pass the AI trigger function
      />

       {/* Render the AI Description Modal */}
       <Dialog open={isDescriptionModalOpen} onOpenChange={(open) => !open && handleCloseDescriptionModal()}>
         <DialogContent className="sm:max-w-[500px]">
           <DialogHeader>
             <DialogTitle>AI Generated Description for {selectedPokemonDetail?.name}</DialogTitle>
             <DialogDescription>
               Powered by Genkit. This description is generated by AI and may not be perfectly accurate.
             </DialogDescription>
           </DialogHeader>
           <div className="py-4 min-h-[100px]">
             {isDescriptionLoading ? (
               <div className="flex justify-center items-center h-full">
                 <WandSparkles className="h-6 w-6 animate-spin text-primary" />
                 <span className="ml-2">Generating...</span>
               </div>
             ) : descriptionError ? (
                <p className="text-destructive text-center">{descriptionError}</p>
             ) : (
               <p className="text-sm whitespace-pre-wrap">{pokemonDescription}</p>
             )}
           </div>
           <DialogFooter>
             <Button type="button" variant="secondary" onClick={handleCloseDescriptionModal}>
               Close
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </div>
  );
}
