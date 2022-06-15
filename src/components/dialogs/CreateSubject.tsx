import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type CreateSubjectProps = {
  open: boolean;
  handleClose: () => void;
  saveSubject: (title: string, desc: string) => void;
}

type FormContent = {
  title: string;
  desc: string;
}

export default function CreateSubject({ open, handleClose, saveSubject }: CreateSubjectProps) {
  const [formData, setFormData] = useState<FormContent>({
    title: '',
    desc: ''
  });

  const { title, desc } = formData;

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveSubject(title, desc);
    setFormData({
      title: '',
      desc: ''
    });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Subject</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a subject, please provide the title and the subject's description.
          </DialogContentText>
          <TextField
            autoFocus
            name="title"
            label="Subject Title"
            fullWidth
            variant="standard"
            value={title}
            onChange={handleTextChange}
            required
            inputProps={{ maxLength: 50 }}
            sx={{ mt: 2 }}
          />
          <TextField
            name="desc"
            label="Subject Description"
            fullWidth
            variant="standard"
            value={desc}
            onChange={handleTextChange}
            required
            inputProps={{ maxLength: 70 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
