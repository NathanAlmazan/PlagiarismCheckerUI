import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Assignment } from '../../util/base';


type CreateAssignmentProps = {
    open: boolean;
    assignment?: Assignment;
    handleClose: () => void;
    saveAssignment: (assignment: Assignment) => void;
}

function CreateAssignment({ open, assignment, handleClose, saveAssignment }: CreateAssignmentProps) {
  const [formData, setFormData] = useState<Assignment>({
    assignTitle: '',
    assignDesc: '',
    assignDueDate: '', 
    assignDueTime: '',
    assignmentId: 0, 
    assignPoints: 10
  });
  const [submission, setSubmission] = useState<Date | null>(new Date());
  const { assignTitle, assignDesc, assignPoints } = formData;

  useEffect(() => {
    if (assignment) {
      setFormData(state => assignment);
      setSubmission(new Date(assignment.assignDueDate + "T" + assignment.assignDueTime))
    }

  }, [assignment])

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleDateChange = (newValue: Date | null) => setSubmission(newValue);


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submission) return;
    saveAssignment({
        assignTitle: assignTitle,
        assignDesc: assignDesc,
        assignDueDate: submission.toISOString().split("T")[0], 
        assignDueTime: submission.toString().split(" ")[4],
        assignmentId: 0, 
        assignPoints: assignPoints
    });

    setFormData({
        assignTitle: '',
        assignDesc: '',
        assignDueDate: '', 
        assignDueTime: '',
        assignmentId: 0, 
        assignPoints: 10
      });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
    <form onSubmit={handleSubmit}>
      <DialogTitle>{assignment ? "Edit Assignment" : "Create Assignment"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {assignment ? 
            "Editing assignment's information won't affect the submitted files. Click save to save changes." : 
            "To create an assignment, please provide the information about the assignment."
          }
        </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
                autoFocus
                name="assignTitle"
                label="Assignment Title"
                fullWidth
                variant="outlined"
                value={assignTitle}
                onChange={handleTextChange}
                required
                inputProps={{ maxLength: 50 }}
                sx={{ mt: 2 }}
            />
            <Stack direction="row" spacing={2} mt={2}>
                <DateTimePicker
                    label="Submission"
                    value={submission}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                />
                <TextField
                    autoFocus
                    name="assignPoints"
                    label="Points"
                    variant="outlined"
                    type="number"
                    value={assignPoints}
                    onChange={handleTextChange}
                    required
                    inputProps={{ min: 1, max: 100 }}
                    fullWidth
                    sx={{ mt: 2 }}
                />
            </Stack>
            <TextField
                multiline
                rows={3}
                name="assignDesc"
                label="Assignment Instructions"
                type="text"
                fullWidth
                variant="outlined"
                value={assignDesc}
                onChange={handleTextChange}
                required
                inputProps={{ maxLength: 250 }}
                sx={{ mt: 2 }}
            />
        </LocalizationProvider>
        </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  </Dialog>
  )
}

export default CreateAssignment