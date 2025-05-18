import { FC, useEffect, useState } from 'react';
import { Box, CircularProgress, TableCell, Typography } from '@mui/material';

import usePokemonDetail from '../hooks/usePokemonDetail';
import Loading from './Loading';
import { createBasicTable } from './BasicTable';

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
              effect: effectEntry?.effect || 'No effect info available'
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

  if (loading || !pokemon) return <Loading />;

  if (error) {
    return (
      <Typography color='error' sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  if (loadingAbilities) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (abilitiesError) {
    return <Typography color='error'>Error: {abilitiesError}</Typography>;
  }

  const DetailTable = createBasicTable<AbilityDetail>();

  return (
    <DetailTable
      caption={`Abilities and effects of ${pokemon.name}`}
      headers={['Ability', 'Effect']}
      rows={abilityDetails}
      renderRow={({ name, effect }) => ({
        key: name, // Use ability name as unique key
        cells: (
          <>
            <TableCell sx={{ textTransform: 'capitalize', border: 0 }}>
              {name}
            </TableCell>
            <TableCell sx={{ border: 0 }}>{effect}</TableCell>
          </>
        )
      })}
    />
  );
};

export default PokemonDetailTable;
