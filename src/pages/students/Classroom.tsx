import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Components
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
// Utils
import { ClassAssignment, Classroom } from "../../util/base";
import { getClassroomData, getStudentAssignments } from "../../util/GetRequests";
import { useAuth } from "../../hocs/AuthProvider";

const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));
const AssignmentList = React.lazy(() => import("../../components/classroom/AssignmentList"));

function ClassroomPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classCode } = useParams();
  const [classDetails, setClassDetails] = useState<Classroom>();
  const [seletced, setSelected] = useState<ClassAssignment>();
  const studentListSection = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState<number[]>([]);

  useEffect(() => {
    if (classCode) {
      getClassroomData(classCode).then(data => {
        setClassDetails(data);
        setSelected(data.assignments[0]);
      }).catch(err => console.log(err));
    }
  }, [classCode]);

  useEffect(() => {
    if (user) {
        if (!user.student) navigate("/teacher/app");
        else {
            const studentNum = user.student as number;

            getStudentAssignments(studentNum).then(data => {
                setSubmitted(state => data)
            })
            .catch(err => console.log(err.message));
        }
    } else navigate("/");
  }, [user, navigate]);

  const handleSelectAssign = (assign: ClassAssignment) => {
    setSelected(assign);
    if (studentListSection.current) window.scrollTo({
      top: studentListSection.current.offsetTop,
      behavior: 'smooth',
    });
  }

  return (
    <>
      <Helmet><title>{classDetails ? classDetails.classroomName : "Class Dashboard"}</title></Helmet>
      <PageTitleWrapper>
        <PageHeader 
            title={classDetails ? classDetails.classroomName : "Class Dashboard"}
            subtitle="View and manage your classroom's tasks." 
            back
        />
      </PageTitleWrapper>
      <Container>
        {classDetails ? (
           <>
            <AssignmentList 
              assignments={classDetails.assignments}
              selected={seletced && seletced.assignmentId}
              selectAssign={handleSelectAssign}
              classCode={classCode as string}
              submitted={submitted}
            />
           </>
        ) : (
          <LoadingOverlay open={classDetails === undefined} />
        )}
      </Container>
    </>
  )
}

export default ClassroomPage