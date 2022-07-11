import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// Components
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/HeaderButton";
// Utils
import { Assignment, ClassAssignment, Classroom } from "../../util/base";
import { getClassroomData } from "../../util/GetRequests";
import { createNewAssignment, deleteAssignmentData, editAssignmentData } from "../../util/PostRequests";

const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));
const AssignmentList = React.lazy(() => import("../../components/classroom/AssignmentList"));
const FileStorageList = React.lazy(() => import("../../components/tables/FilesSubmitted"));
const CreateAssignmentDialog = React.lazy(() => import("../../components/dialogs/CreateAssignment"));
const SuccessSnackbar = React.lazy(() => import("../../components/snackbars/SuccessSnackbar"));

function ClassroomPage() {
  const { classCode } = useParams();
  const [classDetails, setClassDetails] = useState<Classroom>();
  const [seletced, setSelected] = useState<ClassAssignment>();
  const [editAssignment, setEditAssignment] = useState<ClassAssignment>();
  const [createAssign, setCreateAssign] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const studentListSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (classCode) {
      getClassroomData(classCode).then(data => {
        setClassDetails(data);
        setSelected(data.assignments[0]);
      }).catch(err => console.log(err));
    }
  }, [classCode]);

  const handleSelectAssign = (assign: ClassAssignment) => {
    setSelected(assign);
    if (studentListSection.current) window.scrollTo({
      top: studentListSection.current.offsetTop,
      behavior: 'smooth',
    });
  }

  const handleEditAssign = (assign: ClassAssignment) => setEditAssignment(assign);
  const handleDeleteAssign = (assignId: number) => {
    if (classCode) {
      deleteAssignmentData(assignId, classCode).then(data => {
        setClassDetails(data);
        setMessage("Successfully deleted assignment");
      }).catch(err => console.log(err));
    }
  }

  const handleCreateAssignment = (assignment: Assignment) => {
    if (classDetails) {
      setCreateAssign(false);
      createNewAssignment(assignment, classDetails.classroomId, classDetails.classroomCode).then(data => {
        setClassDetails(data);
        setSelected(data.assignments.find(a => a.assignTitle === assignment.assignTitle));
        setMessage("Successfully added " + assignment.assignTitle);
      }).catch(err => console.log(err));
    }
  }

  const saveAssignmentChanges = (assignment: Assignment) => {
    if (classDetails && editAssignment) {
      assignment.assignmentId = editAssignment.assignmentId;
      setEditAssignment(undefined);

      editAssignmentData(assignment, classDetails.classroomId, classDetails.classroomCode).then(data => {
        setClassDetails(data);
        setSelected(data.assignments.find(a => a.assignTitle === assignment.assignTitle));
        setMessage("Successfully updated " + assignment.assignTitle);
      }).catch(err => console.log(err));
    }
  } 

  return (
    <>
      <Helmet><title>{classDetails ? classDetails.classroomName : "Class Dashboard"}</title></Helmet>
      <PageTitleWrapper>
        <PageHeader 
            title={classDetails ? classDetails.classroomName : "Class Dashboard"}
            subtitle="View and manage your classroom's tasks." 
            buttonText="Add Assignment" 
            buttonClick={() => setCreateAssign(true)}
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
              editAssign={handleEditAssign}
              deleteAssign={handleDeleteAssign}
              classCode={classCode as string}
            />
            <div ref={studentListSection} />
            {classDetails.assignments.length > 0 && (
              <FileStorageList 
                assignmentTitle={seletced ? seletced.assignTitle : classDetails.assignments[0].assignTitle} 
                submittedFiles={seletced ? seletced.submittedFiles : classDetails.assignments[0].submittedFiles} 
                classCode={classDetails.classroomCode}
                assignId={seletced ? seletced.assignmentId : classDetails.assignments[0].assignmentId}
              />
            )}
           </>
        ) : (
          <LoadingOverlay open={classDetails === undefined} />
        )}
      </Container>

      <CreateAssignmentDialog 
        open={createAssign}
        handleClose={() => setCreateAssign(false)}
        saveAssignment={handleCreateAssignment}
      />

      <CreateAssignmentDialog 
        open={editAssignment !== undefined}
        assignment={editAssignment}
        handleClose={() => setEditAssignment(undefined)}
        saveAssignment={saveAssignmentChanges}
      />

      <SuccessSnackbar 
        open={message !== null} 
        message={message as string} 
        handleClose={() => setMessage(null)} 
      />
    </>
  )
}

export default ClassroomPage