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
}

interface PokemonTypesResponse {
  results: { name: string; url: string }[];
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

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

    // 2. Fetch details for each Pokemon concurrently
    const pokemonDetailsPromises = listData.results.map(async (pokemonRef) => {
      try {
        const detailResponse = await fetch(pokemonRef.url);
        if (!detailResponse.ok) {
          console.warn(
            `Failed to fetch details for ${pokemonRef.name}: ${detailResponse.status}`
          );
          return null; // Skip this Pokemon if details fail
        }
        const detailData: PokemonDetailsResponse = await detailResponse.json();

        // 3. Format the data
        return {
          id: detailData.id,
          name:
            detailData.name.charAt(0).toUpperCase() + detailData.name.slice(1), // Capitalize name
          imageUrl: detailData.sprites.front_default,
          types: detailData.types
            .sort((a, b) => a.slot - b.slot) // Ensure types are ordered correctly
            .map(
              (typeInfo) =>
                typeInfo.type.name.charAt(0).toUpperCase() +
                typeInfo.type.name.slice(1) // Capitalize type name
            ),
        };
      } catch (error) {
        console.error(`Error fetching details for ${pokemonRef.name}:`, error);
        return null; // Skip this Pokemon on error
      }
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Filter out any null results from failed detail fetches
    return pokemonDetails.filter((pokemon): pokemon is Pokemon => pokemon !== null);

  } catch (error) {
    console.error('Error in getPokemonList:', error);
    throw new Error('Could not retrieve Pokemon data. Please try again later.'); // Propagate a user-friendly error
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
        (type) => type.name.charAt(0).toUpperCase() + type.name.slice(1) // Capitalize
      )
      .filter((typeName) => typeName !== 'Unknown' && typeName !== 'Shadow');
  } catch (error) {
    console.error('Error in getPokemonTypes:', error);
    throw new Error('Could not retrieve Pokemon types. Please try again later.'); // Propagate a user-friendly error
  }
}
