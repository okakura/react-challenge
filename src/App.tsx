import './App.css';

import { FC, useState } from 'react';
import { Alert, Button, Box, Container, Typography } from '@mui/material';

import Loading from 'components/Loading';
import usePokemonList from './hooks/usePokemonList';
import PokemonTable from './components/PokemonTable';
import PaginationControls from './components/PaginationControls';
import PokemonDetailTable from './components/PokemonDetailTable';

const App: FC = () => {
  const {
    pokemon,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage
  } = usePokemonList();

  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  if (loading) return <Loading />;
  if (error) return <Alert severity='error'>Error: {error}</Alert>;

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      {!selectedPokemon ? (
        <>
          <PokemonTable
            data={pokemon}
            onRowClick={(row) => setSelectedPokemon(row.name)}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
            goToPage={goToPage}
          />
        </>
      ) : (
        <>
          <Typography
            variant='body1'
            gutterBottom
            sx={{ textTransform: 'capitalize' }}
          >
            selected pokemon: {selectedPokemon}
          </Typography>
          <PokemonDetailTable pokemonNameOrId={selectedPokemon} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant='text'
              onClick={() => setSelectedPokemon(null)}
              sx={{ textTransform: 'none' }}
            >
              Back to list view
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default App;
