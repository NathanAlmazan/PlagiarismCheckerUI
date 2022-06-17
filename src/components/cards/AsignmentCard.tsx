import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButtton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Assignment } from "../../util/base";

type AssignmentCardProps = {
    assignment: Assignment;
    selected: boolean;
    color: string;
    selectSubject: () => void;
    editSubject: () => void;
    deleteSubject: () => void;
}

function AsignmentCard({ assignment, selected, color, selectSubject, editSubject, deleteSubject }: AssignmentCardProps) {
    const theme = useTheme();
  return (
    <Card sx={{ minWidth: 300, maxWidth: 345, height: 250,  display: "inline-block", borderTop: `8px solid ${color}` }}>
        <CardContent>
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
                alignItems: "center"
            }}
        >
            {!selected && (
                <IconButtton sx={{ borderRadius: "50%" }} onClick={selectSubject}>
                    <Tooltip title="Show Classrooms">
                        <ExpandMoreIcon color="inherit" />
                    </Tooltip>
                </IconButtton>
            )}
            <IconButtton onClick={editSubject} sx={{ borderRadius: "50%" }}>
                <Tooltip title="Edit">
                    <EditOutlinedIcon color="inherit" />
                </Tooltip>
            </IconButtton>
            <IconButtton onClick={deleteSubject} sx={{ borderRadius: "50%" }}>
                <Tooltip title="Delete">
                    <DeleteOutlineOutlinedIcon color="inherit" />
                </Tooltip> 
            </IconButtton>
        </CardActions>
    </Card>
  )
}

export default AsignmentCard