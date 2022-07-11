import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
interface AlertSnackbarProps {
    open: boolean;
    handleClose: () => void;
    message: string;
    severity: AlertColor;
}

function AlertSnackbar({ open, message, severity, handleClose }: AlertSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
  )
}

export default AlertSnackbar