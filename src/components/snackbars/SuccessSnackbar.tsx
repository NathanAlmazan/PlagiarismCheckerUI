import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type SuccessSnackbarProps = {
    open: boolean,
    handleClose: () => void,
    message: string,
}

function SuccessSnackbar({ open, message, handleClose }: SuccessSnackbarProps) {
    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

  return (
    <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
    />
  )
}

export default SuccessSnackbar