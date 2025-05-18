import { useQuery } from '@tanstack/react-query';

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
  pokemon: PokemonDetail | undefined;
  loading: boolean;
  error: string | null;
}

const fetchPokemonDetail = async (
  pokemonNameOrId: string | number
): Promise<PokemonDetail> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
  );
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
};

export default function usePokemonDetail(
  pokemonNameOrId: string | number
): UsePokemonDetailResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pokemonDetail', pokemonNameOrId],
    queryFn: () => fetchPokemonDetail(pokemonNameOrId),
    enabled: !!pokemonNameOrId
  });

  return {
    pokemon: data,
    loading: isLoading,
    error: isError ? (error as Error).message : null
  };
}
