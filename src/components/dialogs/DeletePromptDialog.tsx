import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type DeleteDialogProps = {
    open: boolean;
    entity: string;
    effect: string;
    handleClose: () => void;
    deleteAction: () => void;
}

export default function DeleteDialog({ open, entity, effect, handleClose, deleteAction }: DeleteDialogProps) {
  const handleDelete = () => {
    deleteAction();
    handleClose();
  }
  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${entity}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Deleting ${entity} will also remove all ${effect} and there is no option to undo this action. Please consider thoroughly.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Cancel</Button>
          <Button onClick={handleDelete}>
            Delete Anyway
          </Button>
        </DialogActions>
      </Dialog>
    );
}
