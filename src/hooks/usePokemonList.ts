import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 5;

interface PokemonListResult {
  name: string;
  url: string;
}

interface PokemonApiResponse {
  count: number;
  results: PokemonListResult[];
}

interface UsePokemonListResult {
  pokemon: PokemonListResult[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const fetchPokemon = async (page: number): Promise<PokemonApiResponse> => {
  const offset = (page - 1) * PAGE_SIZE;
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export default function usePokemonList(): UsePokemonListResult {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pokemon', currentPage],
    queryFn: () => fetchPokemon(currentPage),
    placeholderData: (prevData) => prevData
  });

  useEffect(() => {
    if (currentPage < (data?.count ?? 0) / PAGE_SIZE) {
      queryClient.prefetchQuery({
        queryKey: ['pokemon', currentPage + 1],
        queryFn: () => fetchPokemon(currentPage + 1)
      });
    }
  }, [currentPage, data?.count, queryClient]);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.count / PAGE_SIZE) : 0;
  }, [data]);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || (data && page > totalPages)) return;
      setCurrentPage(page);
    },
    [totalPages, data]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    pokemon: data?.results ?? [],
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage
  };
}
