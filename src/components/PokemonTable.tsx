import { FC } from 'react';
import { TableCell } from '@mui/material';
import { createBasicTable } from './BasicTable';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTableProps {
  data: Pokemon[];
  onRowClick?: (pokemon: Pokemon) => void;
}

const ListTable = createBasicTable<Pokemon>();

const PokemonTable: FC<PokemonTableProps> = ({ data, onRowClick }) => {
  return (
    <ListTable
      caption='A list of pokemon'
      headers={['Pokemon Name']}
      rows={data}
      onRowClick={onRowClick}
      highlightOnHover
      renderRow={(pokemon: Pokemon) => ({
        key: pokemon.name,
        cells: (
          <TableCell
            tabIndex={0}
            sx={{
              textTransform: 'capitalize',
              border: 0
            }}
          >
            {pokemon.name}
          </TableCell>
        )
      })}
    />
  );
};

export default PokemonTable;
