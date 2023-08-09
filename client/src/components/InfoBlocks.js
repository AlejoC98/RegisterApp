import { Box, Grid, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { BlockContent } from './global';

const InfoBlocks = ({ data }) => {
  const theme = useTheme();

  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const variant = isLg ? 'h6' : isMd || isSm || isXs ? 'subtitle1' : 'body1';

  return (
    <Box flexGrow={1} mb={6}>
      <Grid container spacing={2}>
        { data.map((cell, index) => (
          <Grid 
            item 
            key={index} 
            md={12 / data.length}
            sm={12 / data.length}
            xs={6}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
            }}
          >
              <BlockContent 
                sx={{ 
                  backgroundColor: cell.color, 
                  width: 'clamp(180px, 50%, 350px)',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  transition: 'all ease .3s',
                  '& *': { color: theme.palette.mode === 'light' ? '#ffffff' : '#000000'},
                  ':hover': {
                    backgroundColor: alpha(cell.color, 0.90),
                    cursor: 'pointer',
                    transform: 'scale(1.02)',
                    boxShadow: '6px 6px 5px 0px rgba(196,196,196,0.75)'
                  }
                }}
                onClick={cell.action}
              >
                { cell.icon }
                <Box>
                  <Typography 
                    variant={variant}
                    sx={{ display: { md: 'block', sm: 'none', xs: 'none'}}}
                  >
                    { cell.title }
                  </Typography>
                  <Typography
                    variant={cell.text.length > 10 ? 'subtitle2' : variant}
                  >
                    { cell.text }
                  </Typography>
                </Box>
              </BlockContent>
            </Grid>
        ))}
      </Grid>
    </Box>
  )
}
export default InfoBlocks