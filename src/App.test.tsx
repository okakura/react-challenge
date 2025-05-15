import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './test/server';

import App from './App';

const mockPages = {
  1: {
    count: 10,
    results: Array.from({ length: 5 }).map((_, i) => ({
      name: `pokemon-${i + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}`
    }))
  },
  2: {
    count: 10,
    results: Array.from({ length: 5 }).map((_, i) => ({
      name: `pokemon-${i + 6}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 6}`
    }))
  }
};

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('App integration', () => {
  beforeEach(() => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
        const url = new URL(request.url);
        const offset = Number(url.searchParams.get('offset')) || 0;
        const page = offset / 5 + 1;
        const mockData = mockPages[page as keyof typeof mockPages] || {
          count: 0,
          results: []
        };
        return HttpResponse.json(mockData);
      })
    );
  });

  it('displays initial Pokémon and navigates pages', async () => {
    render(<App />);

    // Wait for page 1 to load
    await waitFor(() => {
      expect(screen.getByText('pokemon-1')).toBeInTheDocument();
    });

    // Expect some entries from page 1
    expect(screen.getByText('pokemon-5')).toBeInTheDocument();

    // Go to next page
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText('pokemon-6')).toBeInTheDocument();
    });

    expect(screen.queryByText('pokemon-1')).not.toBeInTheDocument();

    // Go back to previous page
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => {
      expect(screen.getByText('pokemon-1')).toBeInTheDocument();
    });
  });

  it('handles empty pages and stays on valid page', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () =>
        HttpResponse.json({ count: 0, results: [] })
      )
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/pokemon/i)).not.toBeInTheDocument();
    });
  });
});
