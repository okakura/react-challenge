// hooks/usePokemonList.ts

import { useEffect, useState } from 'react';

const PAGE_SIZE = 5;

interface PokemonListResult {
  name: string;
  url: string;
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

export default (): UsePokemonListResult => {
  const [pokemon, setPokemon] = useState<PokemonListResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${PAGE_SIZE}`
        );
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setPokemon(data.results);
        setTotalCount(data.count);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    pokemon,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage
  };
};
