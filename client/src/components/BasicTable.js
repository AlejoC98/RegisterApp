import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';

const BasicTable = ({ title, actions, headers, data, fields, color = 'transparent', handleOpen }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box 
            flexGrow={1} 
            boxShadow={
                `6px 8px 5px 0px
                    ${theme.palette.mode === 'light' ? 'rgba(156,156,156,0.75)' : 'rgba(43,43,43,0.75)'}
                `
            }
        >
            <Box 
                display='flex' 
                justifyContent='space-between' 
                backgroundColor={
                    theme.palette.mode === 'light' ? colors.ghostWhite[900] : colors.richBlack[700]
                } 
                p={1.5} 
                borderBottom='1px solid #e9ebec'                
            >
                <Typography variant='h4'>{title}</Typography>
                {actions !== undefined && (
                    <Box className="table-action-buttons" display='flex' justifyContent='space-between'>
                        {actions.map((button, index) => (
                            <Box key={index} mr={2}>{button}</Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Box 
                textAlign="center" 
                p={3} 
                backgroundColor={
                    theme.palette.mode === 'light' ? colors.ghostWhite[900] : colors.richBlack[700]
                }
            >
                {data.length > 0 ? (
                    <Paper>
                        <TableContainer component={Paper} 
                            sx={{ '&.MuiTableContainer-root': 
                                { backgroundColor: color, overflowY: 'scroll', maxHeight: 500 } 
                            }}
                        >
                            <Table sx={{ minWidth: 650 }} aria-label='Basic Table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        {headers.map((header, index) => (
                                            <TableCell key={`header-${index}`}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.map((row, index) => (
                                        <TableRow 
                                            hover 
                                            key={`row-${index}`} 
                                            sx={{ '&:hover': 
                                                { cursor: 'pointer' } 
                                            }} 
                                            onClick={() => { handleOpen(row) }}
                                        >
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            {fields.map((field, count) => (
                                                <TableCell 
                                                    key={`column-${count}`} 
                                                    style={{ 
                                                        maxWidth: '100px', 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis', 
                                                        whiteSpace: 'nowrap' 
                                                    }}
                                                >
                                                    {row[field]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                ) : (
                    <Typography variant="h4">There's no data yet!</Typography>
                )}
            </Box>
        </Box>
    );
};

export default BasicTable;
