import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Classroom } from '../../util/base';

type CreateClassProps = {
  open: boolean;
  options: Options[];
  classInfo?: Classroom | null;
  subject?: number;
  handleClose: () => void;
  saveClass: (subjectId: number, className: string) => void;
}

type Options = {
    id: string,
    label: string
}

type FormContent = {
  subjectId: string;
  className: string;
}

export default function CreateClass({ open, options, classInfo, subject, handleClose, saveClass }: CreateClassProps) {
  const [formData, setFormData] = useState<FormContent>({
    subjectId: '',
    className: ''
  });

  const { subjectId, className } = formData;

  useEffect(() => {
    if (classInfo && subject) setFormData({ subjectId: subject.toString(), className: classInfo.classroomName });
  }, [classInfo, subject])

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, className: event.target.value });
  }

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, subjectId: event.target.value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveClass(parseInt(subjectId), className);
    setFormData({
        subjectId: '',
        className: ''
    });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{classInfo ? "Edit Classroom" : "Create Classroom"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {classInfo ? 
              "Editinng the classroom information will not affect its content. Click save to save changes." : 
              "To create a classroom, please provide the name and select the its subject."
            }
          </DialogContentText>
          <TextField
            autoFocus
            name="className"
            label="Class Name"
            fullWidth
            variant="standard"
            value={className}
            onChange={handleTextChange}
            inputProps={{ maxLength: 20 }}
            required
            sx={{ mt: 2 }}
          />
          <Select
            label="Subject"
            fullWidth
            variant="standard"
            value={subjectId}
            onChange={handleSubjectChange}
            required
            sx={{ mt: 2 }}
          >
            {options.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>{subject.label}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
