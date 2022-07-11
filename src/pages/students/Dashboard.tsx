import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/HeaderButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useTheme } from "@mui/material/styles";
// css
import "../../roomStyles.css";
// data
import { useAuth } from "../../hocs/AuthProvider";
import { ClassroomData, getStudentClassrooms } from "../../util/GetRequests";
import { enrollStudentToClass } from "../../util/PostRequests";

const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));
const EnrollClassroom = React.lazy(() => import("../../components/dialogs/EnrollClassroom"));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [studentId, setStudentId] = useState<number>(0)
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [enroll, setEnroll] = useState<boolean>(false);

  useEffect(() => {
    if (!user) navigate("/");
    else if (!user.student) navigate("/teacher/app");
    else {
        const studentNum = user.student as number;
        setStudentId(state => studentNum);

        getStudentClassrooms(studentNum).then(data => {
            setClassrooms(state => data);
            setLoading(state => false);
        })
        .catch(err => console.log(err.message));
    }
  }, [user, navigate]);

  const handleEnrollStudent = (classCode: string) => {
    enrollStudentToClass(studentId, classCode).then(data => setClassrooms(data))
    .catch(err => console.error(err.message));
  }

  return (
    <>
        <Helmet><title>Student Dashboard</title></Helmet>
        <PageTitleWrapper>
            <PageHeader 
                title={user ? "Good Day, " + user.account.firstName : "Good Day" }
                subtitle="Enroll and manage your classrooms" 
                buttonText="Enroll Class" 
                buttonClick={() => setEnroll(true)}
            />
        </PageTitleWrapper>
        <Container sx={{ minHeight: "50vh" }}>
            <Grid container spacing={2}>
                {classrooms.map(room => (
                    <Grid key={room.classroomCode} item xs={12} sm={4} md={3} style={{transition: theme.transitions.create("all", {
                        easing: theme.transitions.easing.sharp, 
                        duration: theme.transitions.duration.leavingScreen })}}
                    >
                        <Card sx={{ maxWidth: 345, position: "relative" }}>
                            <a href={"/student/class/" + room.classroomCode}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="https://wallpaperaccess.com/full/1741710.jpg"
                                    alt="bg"
                                />
                                <div className="class-content">
                                    <div className="class flex">
                                    <div className="class-left">
                                        <i>{"Prof." + room.classSubject.teacherName}</i>
                                        <div className="heading class">{room.classSubject.subjectName}</div>
                                        <div className="class">{room.classroomName}</div>
                                    </div>
                                    </div>
                                    <div className="divider"></div>
                                </div>
                            </a>
                            <div style={{ width: '100%', height: 100 }} />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
        <LoadingOverlay open={loading} />
        <EnrollClassroom
            open={enroll}
            handleClose={() => setEnroll(false)}
            handleSubmit={handleEnrollStudent}
        />
    </>
  )
}
