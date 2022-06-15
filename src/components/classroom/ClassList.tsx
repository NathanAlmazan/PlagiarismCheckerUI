import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
// Animation
import { motion } from "framer-motion";
// Utils
import { Classroom } from "../../util/base";

type ClassroomProps = {
    className: string;
    classCode: string;
    totalStudents: number;
    totalAssign: number;
}

function ClassroomCard({ className, classCode, totalStudents, totalAssign }: ClassroomProps) {
    return (
        <Card>
            <Stack direction="row" justifyContent="space-between">
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid item sm={12}>
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
                    <Grid item sm={6}>
                        <Typography variant="body1">
                            {`${totalStudents} Students Enrolled`}
                        </Typography>
                        <Typography variant="body1">
                            {`${totalAssign} Active Assignments`}
                        </Typography>
                    </Grid>
                    <Grid item sm={6} sx={{ textAlign: "right" }}>
                        <IconButton sx={{ borderRadius: "50%" }}>
                            <Tooltip title="Edit">
                                <EditOutlinedIcon color="inherit" />
                            </Tooltip>
                        </IconButton>
                        <IconButton sx={{ borderRadius: "50%" }}>
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
                        <ArrowForwardIosOutlinedIcon sx={{ width: 40, height: 40 }} />
                    </motion.div>
                </Stack>
            </Stack>
        </Card>
    )
}

type ClassListProps = {
    classrooms: Classroom[],
    subject: string
}

function ClassList({ classrooms, subject }: ClassListProps) {
  return (
    <>
        <Typography variant="h5" component="div" sx={{ pb: 3, pt: 5, fontSize: 20 }}>
           {`${subject} Classrooms`}
        </Typography>
        <Grid container spacing={2}>
            {classrooms.map((classroom) => (
                <Grid key={classroom.classroomId} item xs={12} md={6}>
                    <ClassroomCard  
                        classCode={classroom.classroomCode}
                        className={classroom.classroomName}
                        totalStudents={classroom.enrolledStudents.length}
                        totalAssign={classroom.assignments.length}
                    />
                </Grid>
            ))}
        </Grid>
    </>
  )
}

export default ClassList