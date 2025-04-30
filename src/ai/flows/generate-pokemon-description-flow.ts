/**
 * @fileOverview Generates a creative description for a given Pokémon.
 *
 * - generatePokemonDescription - A function that generates a description for a Pokemon.
 * - GeneratePokemonDescriptionInput - The input type for the generatePokemonDescription function.
 * - GeneratePokemonDescriptionOutput - The return type for the generatePokemonDescription function.
 */
'use server';

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const GeneratePokemonDescriptionInputSchema = z.object({
  pokemonName: z.string().describe('The name of the Pokémon.'),
});
export type GeneratePokemonDescriptionInput = z.infer<
  typeof GeneratePokemonDescriptionInputSchema
>;

const GeneratePokemonDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe(
      'A creative and engaging Pokedex-style description for the Pokémon.'
    ),
});
export type GeneratePokemonDescriptionOutput = z.infer<
  typeof GeneratePokemonDescriptionOutputSchema
>;

export async function generatePokemonDescription(
  input: GeneratePokemonDescriptionInput
): Promise<GeneratePokemonDescriptionOutput> {
  return generatePokemonDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePokemonDescriptionPrompt',
  input: {
    schema: GeneratePokemonDescriptionInputSchema,
  },
  output: {
    schema: GeneratePokemonDescriptionOutputSchema,
  },
  prompt: `Generate a creative, Pokedex-style description for the Pokémon named {{{pokemonName}}}. Focus on its appearance, abilities, and typical behavior or habitat. Keep it concise (2-3 sentences).`,
});

const generatePokemonDescriptionFlow = ai.defineFlow<
  typeof GeneratePokemonDescriptionInputSchema,
  typeof GeneratePokemonDescriptionOutputSchema
>(
  {
    name: 'generatePokemonDescriptionFlow',
    inputSchema: GeneratePokemonDescriptionInputSchema,
    outputSchema: GeneratePokemonDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
