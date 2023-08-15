import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react';
import DialogModal from './DialogModal';

const CollapseList = ({ title, data, fields, handleOpen, mode = 'display', editActions = {}}) => {

    return (
        <Box flexGrow={1} width='100%'>
            <Box display='flex' justifyContent='center' position='relative' alignItems='center'>
                <Typography variant='h4'>{title}</Typography>
                {mode === 'edit' && (
                    <Box position='absolute' right={32}>
                        { editActions.addBtn }
                    </Box>
                )}
            </Box>
            <List>
                {data.map((ele, index) => (
                    <Box key={`element-${index}`}>
                        {mode === 'display' ? (
                            <ListItem>
                                <ListItemButton onClick={() => { handleOpen(ele) }}>
                                    <ListItemText primary={fields[0] === 'fullname' ? `${ele.firstname} ${ele.lastname}` : ele[fields[0]]} secondary={ele[fields[1]]} />
                                </ListItemButton>
                            </ListItem>
                        ) : (
                            <ListItem>
                                <ListItemText primary={fields[0] === 'fullname' ? `${ele.firstname} ${ele.lastname}` : ele[fields[0]]} secondary={ele[fields[1]]} />
                                {mode === 'edit' && (
                                    <ListItemIcon>
                                        <DialogModal
                                                title={editActions.removeBtn.title}
                                                buttonText=''
                                                buttonColor='error'
                                                buttonType={2}
                                                buttonIcon='DeleteRounded'
                                                content={
                                                    <Box
                                                        display='flex'
                                                        justifyContent='center'
                                                        alignItems='center'
                                                        p={3}
                                                    >
                                                        <Typography variant='h6'>
                                                           { editActions.removeBtn.text }
                                                        </Typography>
                                                    </Box>
                                                }
                                                actionButtons={
                                                    {
                                                        disagree: { text: 'Cancel' },
                                                        agree: { text: 'Confirm', func: () => editActions.removeBtn.func(ele) }
                                                    }
                                                }
                                            />
                                    </ListItemIcon>
                                )}
                            </ListItem>
                        )}
                        {(index + 1) !== data.length && (
                            <Divider />
                        )}
                    </Box>
                ))}
            </List>
        </Box>
    )
}

export default CollapseList