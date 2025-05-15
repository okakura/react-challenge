import { FC, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

import Loading from './Loading';
import usePokemonDetail from '../hooks/usePokemonDetail';

interface AbilityDetail {
  name: string;
  effect: string;
}

interface PokemonDetailTableProps {
  pokemonNameOrId: string | number;
}

const PokemonDetailTable: FC<PokemonDetailTableProps> = ({
  pokemonNameOrId
}) => {
  const { pokemon, loading, error } = usePokemonDetail(pokemonNameOrId);
  const [abilityDetails, setAbilityDetails] = useState<AbilityDetail[]>([]);
  const [loadingAbilities, setLoadingAbilities] = useState(false);
  const [abilitiesError, setAbilitiesError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemon) return;

    const fetchAbilitiesDetails = async () => {
      setLoadingAbilities(true);
      setAbilitiesError(null);

      try {
        const details = await Promise.all(
          pokemon.abilities.map(async (a) => {
            const res = await fetch(a.ability.url);
            if (!res.ok) throw new Error('Failed to fetch ability details');
            const data = await res.json();

            const effectEntry = data.effect_entries.find(
              (entry: any) => entry.language.name === 'en'
            );

            return {
              name: a.ability.name,
              effect: effectEntry
                ? effectEntry.effect
                : 'No effect info available'
            };
          })
        );

        setAbilityDetails(details);
      } catch (err: any) {
        setAbilitiesError(err.message || 'Failed to load ability details');
      } finally {
        setLoadingAbilities(false);
      }
    };

    fetchAbilitiesDetails();
  }, [pokemon]);

  const renderHeader = (
    <Typography
      variant='h5'
      align='center'
      gutterBottom
      sx={{ textTransform: 'capitalize' }}
    >
      {pokemon?.name ? `Selected Pokémon: ${pokemon.name}` : ''}
    </Typography>
  );

  if (loading || !pokemon) {
    return <Loading />;
  }

  if (error) {
    return (
      <Typography color='error' sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  if (loadingAbilities) {
    return (
      <TableContainer component={Paper}>
        {renderHeader}
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      </TableContainer>
    );
  }

  if (abilitiesError) {
    return (
      <TableContainer component={Paper}>
        {renderHeader}
        <Typography color='error'>Error: {abilitiesError}</Typography>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} aria-label='Pokemon ability table'>
      <Table>
        <caption
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}
        >
          {`Abilities and effects of ${pokemon.name}`}
        </caption>
        <TableHead>
          <TableRow sx={{ background: '#ACCDF7' }}>
            <TableCell>Ability</TableCell>
            <TableCell>Effect</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ 'tr:nth-of-type(odd)': { background: '#F8F8F8' } }}>
          {abilityDetails.map(({ name, effect }) => (
            <TableRow key={name}>
              <TableCell sx={{ textTransform: 'capitalize', border: 0 }}>
                {name}
              </TableCell>
              <TableCell sx={{ border: 0 }}>{effect}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PokemonDetailTable;
