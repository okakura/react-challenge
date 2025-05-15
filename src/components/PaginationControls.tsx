import { Box, Button, Typography } from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  goToPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  goToPage
}) => {
  return (
    <Box
      sx={{
        background: '#DDEBFD',
        border: 'solid 1px lightgrey',
        borderTop: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: '7px'
      }}
    >
      <Button
        variant='text'
        onClick={() => goToPage(1)}
        disabled={currentPage <= 1}
        aria-label='First page'
      >
        <FirstPage />
      </Button>
      <Button
        variant='text'
        onClick={onPrev}
        disabled={currentPage <= 1}
        aria-label='previous page'
      >
        <NavigateBefore />
      </Button>
      <Typography>
        Page {currentPage} of {totalPages}
      </Typography>
      <Button
        variant='text'
        onClick={onNext}
        disabled={currentPage >= totalPages}
        aria-label='Next page'
      >
        <NavigateNext />
      </Button>
      <Button
        variant='text'
        onClick={() => goToPage(totalPages)}
        disabled={currentPage >= totalPages}
        aria-label='Last page'
      >
        <LastPage />
      </Button>
    </Box>
  );
};

export default PaginationControls;
