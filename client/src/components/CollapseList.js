import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'

const CollapseList = ({ title, data, fields, handleOpen }) => {
  return (
    <Box flexGrow={1} width='100%'>
        <Typography variant='h4'>{ title }</Typography>
        <List>
            { data.map((ele, index) => (
                <Box key={`element-${index}`}>
                    <ListItem>
                        <ListItemButton onClick={() => { handleOpen(ele) }}>
                            <ListItemText primary={ fields[0] === 'fullname' ? `${ele.firstname} ${ele.lastname}` : ele[fields[0]]} secondary={ele[fields[1]]} />
                        </ListItemButton>
                    </ListItem>
                    { (index + 1) !== data.length && (
                        <Divider />
                    )}
                </Box>
            ))}
        </List>
    </Box>
  )
}

export default CollapseList