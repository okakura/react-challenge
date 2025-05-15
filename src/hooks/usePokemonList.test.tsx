import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import usePokemonList from './usePokemonList';

const PokemonListTestComponent = () => {
  const {
    pokemon,
    loading,
    nextPage,
    prevPage,
    goToPage,
    error,
    currentPage,
    totalPages
  } = usePokemonList();

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {pokemon.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <button
        type='button'
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button type='button' onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <button type='button' onClick={() => goToPage(2)}>
        Go to page 2
      </button>
    </div>
  );
};

describe('usePokemonList Tests', () => {
  it('fetches and displays first page of Pokémon', async () => {
    render(<PokemonListTestComponent />);

    // Wait for pokemon-1 to appear
    const firstPokemon = await screen.findByText((content) =>
      content.includes('pokemon-1')
    );
    expect(firstPokemon).toBeInTheDocument();

    // Also check another pokemon on the page
    expect(await screen.findByText('pokemon-5')).toBeInTheDocument();

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('navigates to next page correctly', async () => {
    render(<PokemonListTestComponent />);

    await screen.findByText('pokemon-1');
    fireEvent.click(screen.getByText('Next'));

    await screen.findByText('pokemon-6');
    expect(screen.getByText('pokemon-10')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });

  it('navigates to previous page correctly', async () => {
    render(<PokemonListTestComponent />);

    await screen.findByText('pokemon-1');
    fireEvent.click(screen.getByText('Go to page 2'));

    await screen.findByText('pokemon-6');
    fireEvent.click(screen.getByText('Previous'));

    await screen.findByText('pokemon-1');
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables next button on last page', async () => {
    render(<PokemonListTestComponent />);

    await screen.findByText('pokemon-1');
    fireEvent.click(screen.getByText('Go to page 2'));
    await screen.findByText('pokemon-6');

    fireEvent.click(screen.getByText('Next'));
    await screen.findByText('pokemon-11');

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('disables previous button on first page', async () => {
    render(<PokemonListTestComponent />);

    await screen.findByText('pokemon-1');
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });
});
