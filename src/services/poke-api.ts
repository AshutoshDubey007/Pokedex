
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Represents basic information about a Pokemon.
 */
export interface Pokemon {
  /**
   * The name of the Pokemon.
   */
  name: string;
  /**
   * The URL of the Pokemon's sprite image.
   */
  imageUrl: string;
  /**
   * The types of the Pokemon.
   */
  types: string[];
  /**
   * The ID of the Pokemon.
   */
  id: number;
}

/**
 * Represents detailed information about a Pokemon, extending basic info.
 */
export interface PokemonDetail extends Pokemon {
  /**
   * The abilities of the Pokemon.
   */
  abilities: string[];
  /**
   * The base stats of the Pokemon.
   */
  stats: {
    name: string;
    value: number;
  }[];
  /**
   * Height in decimetres.
   */
  height: number;
  /**
   * Weight in hectograms.
   */
  weight: number;
}


interface PokeApiResponse {
  results: { name: string; url: string }[];
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
}

interface PokemonTypesResponse {
  results: { name: string; url: string }[];
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Helper function to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper function to format stat names
const formatStatName = (name: string): string => {
  switch (name) {
    case 'hp': return 'HP';
    case 'attack': return 'Attack';
    case 'defense': return 'Defense';
    case 'special-attack': return 'Sp. Atk';
    case 'special-defense': return 'Sp. Def';
    case 'speed': return 'Speed';
    default: return capitalize(name);
  }
};


/**
 * Asynchronously retrieves a list of Pokemon with their details.
 * @returns A promise that resolves to an array of Pokemon objects.
 * @throws Throws an error if fetching or processing data fails.
 */
export async function getPokemonList(): Promise<Pokemon[]> {
  try {
    // 1. Fetch the list of the first 150 Pokemon names and URLs
    const listResponse = await fetch(
      `${POKEAPI_BASE_URL}/pokemon?limit=150&offset=0`
    );
    if (!listResponse.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${listResponse.status}`);
    }
    const listData: PokeApiResponse = await listResponse.json();

    // 2. Fetch basic details for each Pokemon concurrently (only needed fields for the grid)
    const pokemonPromises = listData.results.map(async (pokemonRef) => {
      try {
        const detailResponse = await fetch(pokemonRef.url);
        if (!detailResponse.ok) {
          console.warn(
            `Failed to fetch details for ${pokemonRef.name}: ${detailResponse.status}`
          );
          return null; // Skip this Pokemon if details fail
        }
        // We only need partial details here for the grid view
        const detailData: Pick<PokemonDetailsResponse, 'id' | 'name' | 'sprites' | 'types'> = await detailResponse.json();

        // 3. Format the data
        return {
          id: detailData.id,
          name: capitalize(detailData.name), // Capitalize name
          imageUrl: detailData.sprites.front_default,
          types: detailData.types
            .sort((a, b) => a.slot - b.slot) // Ensure types are ordered correctly
            .map(
              (typeInfo) => capitalize(typeInfo.type.name) // Capitalize type name
            ),
        };
      } catch (error) {
        console.error(`Error fetching details for ${pokemonRef.name}:`, error);
        return null; // Skip this Pokemon on error
      }
    });

    const pokemonResults = await Promise.all(pokemonPromises);

    // Filter out any null results from failed detail fetches
    return pokemonResults.filter((pokemon): pokemon is Pokemon => pokemon !== null);

  } catch (error) {
    console.error('Error in getPokemonList:', error);
    throw new Error('Could not retrieve Pokemon data. Please try again later.'); // Propagate a user-friendly error
  }
}

/**
 * Asynchronously retrieves detailed information for a single Pokemon.
 * @param idOrName The ID or name of the Pokemon.
 * @returns A promise that resolves to a PokemonDetail object or null if not found/error.
 * @throws Throws an error if the network request fails fundamentally.
 */
export async function getPokemonDetails(idOrName: string | number): Promise<PokemonDetail | null> {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Pokemon with ID/Name "${idOrName}" not found.`);
                return null;
            }
            throw new Error(`Failed to fetch details for Pokemon "${idOrName}": ${response.status}`);
        }
        const data: PokemonDetailsResponse = await response.json();

        return {
            id: data.id,
            name: capitalize(data.name),
            imageUrl: data.sprites.front_default,
            types: data.types
                .sort((a, b) => a.slot - b.slot)
                .map((typeInfo) => capitalize(typeInfo.type.name)),
            abilities: data.abilities
                // .filter(abilityInfo => !abilityInfo.is_hidden) // Optionally filter hidden abilities
                .sort((a, b) => a.slot - b.slot)
                .map((abilityInfo) => capitalize(abilityInfo.ability.name)),
            stats: data.stats.map((statInfo) => ({
                name: formatStatName(statInfo.stat.name),
                value: statInfo.base_stat,
            })),
            height: data.height, // in decimetres
            weight: data.weight, // in hectograms
        };
    } catch (error) {
        console.error(`Error fetching details for Pokemon "${idOrName}":`, error);
        // Depending on requirements, you might want to return null or re-throw
        // Returning null for simplicity in the UI handling
        return null;
    }
}


/**
 * Asynchronously retrieves a list of available Pokemon types.
 * @returns A promise that resolves to an array of strings representing Pokemon types.
 * @throws Throws an error if fetching fails.
 */
export async function getPokemonTypes(): Promise<string[]> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
    }
    const data: PokemonTypesResponse = await response.json();
    // Filter out 'unknown' and 'shadow' types if they exist, and capitalize
    return data.results
      .map(
        (type) => capitalize(type.name) // Capitalize
      )
      .filter((typeName) => typeName !== 'Unknown' && typeName !== 'Shadow');
  } catch (error) {
    console.error('Error in getPokemonTypes:', error);
    throw new Error('Could not retrieve Pokemon types. Please try again later.'); // Propagate a user-friendly error
  }
}
