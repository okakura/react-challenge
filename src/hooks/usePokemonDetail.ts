import { useEffect, useState } from 'react';

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    [key: string]: any;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string; url: string } }[];
}

interface UsePokemonDetailResult {
  pokemon: PokemonDetail | null;
  loading: boolean;
  error: string | null;
}

export default function usePokemonDetail(
  pokemonNameOrId: string | number
): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonNameOrId) return;

    const fetchPokemonDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
        );
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setPokemon(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [pokemonNameOrId]);

  return { pokemon, loading, error };
}
