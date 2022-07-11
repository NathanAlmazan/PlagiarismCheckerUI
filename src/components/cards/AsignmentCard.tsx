import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButtton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteDialog from "../dialogs/DeletePromptDialog";
// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import { Assignment } from "../../util/base";

type AssignmentCardProps = {
    assignment: Assignment;
    selected: boolean;
    color: string;
    classCode: string;
    submitted?: boolean;
    selectSubject: () => void;
    editSubject?: () => void;
    deleteSubject?: () => void;
}

function AsignmentCard({ assignment, selected, classCode, color, submitted, selectSubject, editSubject, deleteSubject }: AssignmentCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => setOpen(!open);

  const handleSubmitAssign = () => navigate(`/student/submit/${classCode}/${assignment.assignmentId}`);

  return (
    <Card sx={{ minWidth: 300, maxWidth: 345, height: "100%",  display: "inline-block", position: "relative", borderTop: `8px solid ${color}` }}>
        <CardContent sx={{ mb: 3 }}>
            <Typography gutterBottom variant="h5" component="div" color={selected ? "primary.main" : "inherit"} sx={{ fontSize: 18, borderBottom: `1px solid ${theme.colors.primary.main}`, pb: 1 }}>
                {assignment.assignTitle}
            </Typography>
            
            <Stack direction="row" justifyContent="space-between" sx={{ pb: 1 }}>
                <Typography variant="body2" align="right" sx={{ fontWeight: 'bold' }} color={selected ? "primary.light" : "text.secondary"}>
                    {`${assignment.assignPoints} points`}
                </Typography>
                <Stack direction="column">
                    <Typography variant="body2" align="right" sx={{ fontWeight: 'bold' }} color={selected ? "primary.light" : "text.secondary"}>
                        {new Date(assignment.assignDueDate).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                        })}
                    </Typography>
                    <Typography variant="body2" align="right" color={selected ? "primary.light" : "text.secondary"}>
                        {new Date(`${assignment.assignDueDate}T${assignment.assignDueTime}`).toLocaleTimeString('en-US')}
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="body2" align="justify" color={selected ? "primary.light" : "text.secondary"}>
                {assignment.assignDesc.length > 100 ? assignment.assignDesc.slice(0, 100) + "..." : assignment.assignDesc}
            </Typography>
        </CardContent>
        <CardActions 
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "absolute",
                bottom: 0
            }}
        >
            {Boolean(!selected || !editSubject) && (
                <IconButtton sx={{ borderRadius: "50%" }} disabled={submitted} onClick={editSubject ? selectSubject : handleSubmitAssign}>
                    <Tooltip title={editSubject ? "Show Classrooms" : "Submit Assignment"}>
                        {editSubject ? 
                            <ExpandMoreIcon color="inherit" /> : <PublishIcon color="inherit" />    
                        }
                    </Tooltip>
                </IconButtton>
            )}
            {editSubject && (
                <IconButtton onClick={editSubject} sx={{ borderRadius: "50%" }}>
                    <Tooltip title="Edit">
                        <EditOutlinedIcon color="inherit" />
                    </Tooltip>
                </IconButtton>
            )}
            {deleteSubject && (
                <IconButtton onClick={handleDelete} sx={{ borderRadius: "50%" }}>
                    <Tooltip title="Delete">
                        <DeleteOutlineOutlinedIcon color="inherit" />
                    </Tooltip> 
                </IconButtton>
            )}
        </CardActions>
    
        {deleteSubject && (
            <DeleteDialog 
                open={open}  
                handleClose={handleDelete}
                entity={assignment.assignTitle}
                effect="submitted files"
                deleteAction={deleteSubject}
            />
        )}
    </Card>
  )
}

export default AsignmentCard