import { FC } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTableProps {
  data: Pokemon[];
  onRowClick?: (pokemon: Pokemon) => void;
}

const PokemonTable: FC<PokemonTableProps> = ({ data, onRowClick }) => (
  <TableContainer component={Paper} aria-label='Pokemon table'>
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
        A list of pokemon
      </caption>

      <TableHead>
        <TableRow sx={{ background: '#ACCDF7' }}>
          <TableCell>Pokemon Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ 'tr:nth-of-type(odd)': { background: '#F8F8F8' } }}>
        {data.map((pokemon) => (
          <TableRow
            key={pokemon.name}
            onClick={() => onRowClick && onRowClick(pokemon)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            <TableCell
              tabIndex={0}
              sx={{
                textTransform: 'capitalize',
                border: '0',
                '&:hover': { backgroundColor: '#e0f2ff' }
              }}
            >
              {pokemon.name}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PokemonTable;
