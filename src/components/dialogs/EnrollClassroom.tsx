import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface EnrollClassProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: (classCode: string) => void;
}

function EnrollClassroom({ open, handleClose, handleSubmit }: EnrollClassProps) {
  const [code, setCode] = useState<string>('');

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(code);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitForm} style={{ margin: 20 }}>
            <DialogTitle sx={{ p: 0 }}>{"Enroll a Class"}</DialogTitle>
            <DialogContentText>
                Please ask your Professor for your classroom code.
            </DialogContentText>
            <TextField
                name="code"
                label="Classroom Code"
                fullWidth
                variant="standard"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                inputProps={{ maxLength: 10 }}
                sx={{ mt: 2 }}
            />
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Enroll</Button>
            </DialogActions>
        </form>
    </Dialog>
  )
}

export default EnrollClassroom