import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export interface TableProps<T> {
  caption?: string;
  headers: string[];
  rows: T[];
  renderRow: (row: T, index: number) => { key: string; cells: ReactNode };
  onRowClick?: (item: T) => void;
  highlightOnHover?: boolean;
}

const BasicTable = <T,>({
  caption,
  headers,
  rows,
  renderRow,
  onRowClick,
  highlightOnHover = false
}: TableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        {caption && (
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
            {caption}
          </caption>
        )}
        <TableHead>
          <TableRow sx={{ background: '#ACCDF7' }}>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ 'tr:nth-of-type(odd)': { background: '#F8F8F8' } }}>
          {rows.map((item, index) => {
            const { key, cells } = renderRow(item, index);
            return (
              <TableRow
                key={key}
                onClick={() => onRowClick?.(item)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': highlightOnHover
                    ? { backgroundColor: '#e0f2ff' }
                    : undefined
                }}
              >
                {cells}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;

export const createBasicTable = <T,>() => {
  return (props: TableProps<T>) => <BasicTable<T> {...props} />;
};
