import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon*', ({ request }) => {
    const url = new URL(request.url);

    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);

    const results = Array.from({ length: limit }, (_, i) => {
      const id = offset + i + 1;
      return {
        name: `pokemon-${id}`,
        url: `https://pokeapi.co/api/v2/pokemon/${id}/`
      };
    });

    return HttpResponse.json({
      count: 15,
      results
    });
  })
];

export const server = setupServer(...handlers);
