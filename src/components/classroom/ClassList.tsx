import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import DeleteDialog from "../dialogs/DeletePromptDialog";
// Animation
import { motion } from "framer-motion";
// Utils
import { useNavigate } from "react-router-dom";
import { Classroom } from "../../util/base";

type ClassroomProps = {
    className: string;
    classCode: string;
    totalStudents: number;
    totalAssign: number;
    editClassroom: () => void;
    deleteClassroom: () => void;
}

function ClassroomCard({ className, classCode, totalStudents, totalAssign, editClassroom, deleteClassroom }: ClassroomProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

    const handleDelete = () => setOpen(!open);
    
    return (
        <Card>
            <Stack direction="row" justifyContent="space-between">
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid item xs={12} sm={12}>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
                            <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
                                {className}
                            </Typography>
                            <Typography variant="body2" color="secondary.main" fontWeight="bold" pt={1} gutterBottom>
                            {"Code: " + classCode}
                            </Typography>
                        </Stack>
                        
                        <Divider />
                        
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="body1">
                            {`${totalStudents} Students Enrolled`}
                        </Typography>
                        <Typography variant="body1">
                            {`${totalAssign} Active Assignments`}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ textAlign: "right" }}>
                        <IconButton onClick={editClassroom} sx={{ borderRadius: "50%" }}>
                            <Tooltip title="Edit">
                                <EditOutlinedIcon color="inherit" />
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={handleDelete} sx={{ borderRadius: "50%" }}>
                            <Tooltip title="Delete">
                                <DeleteOutlineOutlinedIcon color="inherit" />
                            </Tooltip> 
                        </IconButton>
                    </Grid>
                </Grid>
                <Stack direction="column" justifyContent="center" alignItems="center" sx={{ minWidth: 60, bgcolor: "#AEC6CF" }}>
                    <motion.div
                        whileHover={{
                            x: 15,
                            transition: { duration: 1 }
                        }}
                    >
                        <IconButton onClick={() => navigate(`/teacher/class/${classCode}`)}>
                            <ArrowForwardIosOutlinedIcon sx={{ width: 40, height: 40 }} />
                        </IconButton>
                    </motion.div>
                </Stack>
            </Stack>
            <DeleteDialog 
                open={open}  
                handleClose={handleDelete}
                entity={className}
                effect="enrolled students and class assignments"
                deleteAction={deleteClassroom}
            />
        </Card>
    )
}

type ClassListProps = {
    classrooms: Classroom[],
    subject: string,
    editClassroom: (room: Classroom) => void,
    delteClassroom: (roomId: number) => void
}

function ClassList({ classrooms, subject, editClassroom, delteClassroom }: ClassListProps) {
  return (
    <>
        <Typography variant="h5" component="div" sx={{ pb: 3, pt: 5, fontSize: 20 }}>
           {`${subject} Classrooms`}
        </Typography>
        <Grid container spacing={2} sx={{ minHeight: 300 }}>
            {classrooms.map((classroom) => (
                <Grid key={classroom.classroomId} item xs={12} md={6}>
                    <ClassroomCard  
                        classCode={classroom.classroomCode}
                        className={classroom.classroomName}
                        totalStudents={classroom.enrolledStudents.length}
                        totalAssign={classroom.assignments.length}
                        editClassroom={() => editClassroom(classroom)}
                        deleteClassroom={() => delteClassroom(classroom.classroomId)}
                    />
                </Grid>
            ))}
            {classrooms.length === 0 && (
                <Grid item sm={12}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: { xs: 220, sm: 300 }
                    }}>
                        <img alt="productivity" src="/images/covers/productivity.png" style={{ height: "100%" }} />
                        <Typography variant="h5">
                            No classroom created yet.
                        </Typography>
                    </Box>
                </Grid>
            )}
        </Grid>
    </>
  )
}

export default ClassList