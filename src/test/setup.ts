import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';
import '@testing-library/jest-dom';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
