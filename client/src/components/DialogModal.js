import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getIconComponent } from './global';

const DialogModal = ({title, buttonColor = 'primary', buttonType = 1, buttonIcon = '', buttonText, actionButtons = {}, content}) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Box flexGrow={1}>
            { buttonType === 1 ? (
                <Button variant='contained' color={buttonColor} onClick={handleOpen}>
                    {buttonText}
                </Button>
            ) : buttonType === 2 ? (
                <IconButton onClick={handleOpen}>
                    { getIconComponent(buttonIcon, buttonColor) }
                </IconButton>
            ) : buttonType === 3 && (
                <Fab size='small' color={buttonColor} aria-label='add' onClick={handleOpen}>
                    { getIconComponent(buttonIcon) }
                </Fab>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #e9ebec'}}>
                    <Typography variant='h5' fontWeight='bold' textAlign='center'>{ title }</Typography>
                    <IconButton
                        aria-label='Close'
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 500}}>
                    <DialogContentText>{ content }</DialogContentText>
                </DialogContent>
                    { Object.keys(actionButtons).length > 0 && (
                        <DialogActions sx={{ width: '100%', display:'flex', justifyContent: 'space-between', p: '10px 20px'}}>
                            <Button
                                color='error' 
                                onClick={handleClose}
                            >
                                { actionButtons.disagree.text }
                            </Button>
                            <Button
                                color='info'
                                onClick={() => {actionButtons.agree.func(); handleClose();}}
                                autoFocus
                            >
                                { actionButtons.agree.text }
                            </Button>
                        </DialogActions>
                    )}
            </Dialog>
        </Box>
    )
}

export default DialogModal