import { FC } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const Loading: FC = () => (
  <Box
    role='status'
    aria-live='polite'
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      position: 'relative'
    }}
  >
    <Typography
      component='span'
      sx={{
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        whiteSpace: 'nowrap',
        border: 0,
        padding: 0,
        margin: -1
      }}
    >
      Loading…
    </Typography>
    <CircularProgress />
  </Box>
);

export default Loading;
