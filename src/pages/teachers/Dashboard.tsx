// components
import React, { useState, useEffect, useRef } from "react";
// Components
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/HeaderButton";
import Container from "@mui/material/Container";
// Utils
import { Subject, AxiosError, Classroom } from "../../util/base";
import { getTeacherSubjects } from "../../util/GetRequests";
import { createNewClassroom, createNewSubject, editSubjectData, deleteSubject, deleteClassroom, editClassroomData } from "../../util/PostRequests"; 
// Animation 
import { AnimatePresence, motion } from "framer-motion";

const SubjectList = React.lazy(() => import("../../components/classroom/SubjectList"));
const ClassList = React.lazy(() => import("../../components/classroom/ClassList"));
const CreateSubjectDialog = React.lazy(() => import("../../components/dialogs/CreateSubject"));
const CreateClassDialog = React.lazy(() => import("../../components/dialogs/CreateClass"));
const SuccessSnackbar = React.lazy(() => import("../../components/snackbars/SuccessSnackbar"));
const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));
const ErrorDialog = React.lazy(() => import("../../components/dialogs/ErrorDialog"));

function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<Subject>();
  const [createSub, setCreateSub] = useState<boolean>(false);
  const [createClass, setCreateClass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [editRoom, setEditRoom] = useState<Classroom | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const classListSection = useRef<HTMLDivElement>(null);

  const handleSelectSubject = (subjectId: number) => {
    setSelected(subjects.find(s => s.subjectId === subjectId));
    if (classListSection.current) window.scrollTo({
        top: classListSection.current.offsetTop,
        behavior: 'smooth',
    });
  }

  useEffect(() => {
    getTeacherSubjects(6).then(data => {
        setSubjects(state => data);
        setSelected(state => data[0]);
    })
    .catch(err => console.log(err.message));
  }, []);

  const handleAddSuject = (title: string, desc: string) => {
    setLoading(true);
    createNewSubject(title, desc, 6).then(data => {
        setSubjects(data);
        setLoading(false);
        setCreateSub(false);
        setMessage("Successfully added " + title);
    }).catch(err => console.log(err.message));
  }

  const handleAddClass = (subjectId: number, className: string) => {
    setLoading(true);
    createNewClassroom(subjectId, className, 6).then(data => {
        setSubjects(data);
        setLoading(false);
        setCreateClass(false);
        setMessage("Successfully added " + className);

        const classSub = data.find(s => s.subjectId === subjectId)
        if (classSub) setSelected(classSub);
    }).catch(err => console.log(err.message));
  }

  const handleEditSubject = (title: string, desc: string) => {
    if (editSubject) {
        editSubjectData(title, desc, editSubject.subjectId, 6)
        .then(data => {
            setSubjects(data);
            
            const classSub = data.find(s => s.subjectId === editSubject.subjectId)
            if (classSub) setSelected(classSub);

            setMessage("Sucessfully updated " + title);
            setEditSubject(null);
        })
        .catch(err => console.log(err.message));
    }
  }

  const handleDeleteSubject = (subjectId: number) => {
    deleteSubject(subjectId, 6).then(data => {
        setSubjects(data);
        setSelected(data[0]);
        setMessage("Subject was deleted sucessfully.");
    }).catch(err => setError("Cannot Delete Subject:" + (err as AxiosError).response.data.errors[0]));
  }

  const handleEditClassroom = (subjectId: number, className: string) => {
    if (editRoom) {
        editClassroomData(editRoom.classroomId, className, subjectId, 6).then(data => {
            setSubjects(data);
            
            const classSub = data.find(s => s.subjectId === subjectId)
            if (classSub) setSelected(classSub);

            setMessage("Sucessfully updated " + className);
            setEditRoom(null);
        }).catch(err => console.log(err.message));
    }
  } 

  const handleDeleteClassroom = (classId: number) => {
    deleteClassroom(classId, 6).then(data => {
        setSubjects(data);

        if (selected) {
            const classSub = data.find(s => s.subjectId === selected?.subjectId);
            if (classSub) setSelected(classSub);
        } else setSelected(data[0]);

        setMessage("Classroom was deleted sucessfully.");

    }).catch(err => {
        getTeacherSubjects(6).then(data => {
            setSubjects(data);

            if (selected) {
                const classSub = data.find(s => s.subjectId === selected?.subjectId);
                if (classSub) setSelected(classSub);
            } else setSelected(data[0]);

            setMessage("Classroom was deleted sucessfully.");
        })
    });
  }

  return (
    <>
        <Helmet><title>Teacher Dashboard</title></Helmet>
        <PageTitleWrapper>
            <PageHeader 
                title="Good Day, Nathan" 
                subtitle="View and manage your subjects and classrooms" 
                buttonText="Create Classroom" 
                buttonClick={() => setCreateClass(true)}
            />
        </PageTitleWrapper>
        <Container>

            <SubjectList 
                subjectList={subjects} 
                selectSubject={handleSelectSubject} 
                addSubject={() => setCreateSub(true)}
                editSubject={(subject) => setEditSubject(subject)}
                deleteSubject={handleDeleteSubject}
                selectedSub={selected && selected.subjectId}
            />

            <AnimatePresence exitBeforeEnter>
                <div ref={classListSection} />
                {selected && (
                    <motion.div
                        key={selected.subjectId}
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 80 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ClassList 
                            classrooms={selected.classrooms} 
                            subject={selected.subjectTitle}
                            editClassroom={(room) => setEditRoom(room)}
                            delteClassroom={handleDeleteClassroom}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
        
        <CreateSubjectDialog 
            open={createSub}
            handleClose={() => setCreateSub(false)}
            saveSubject={handleAddSuject}
        />

        <CreateSubjectDialog 
            open={editSubject !== null}
            subject={editSubject}
            handleClose={() => setEditSubject(null)}
            saveSubject={handleEditSubject}
        />

        <CreateClassDialog 
            open={createClass}
            options={subjects.map((subject) => ({ id: subject.subjectId.toString(), label: subject.subjectTitle }))}
            handleClose={() => setCreateClass(false)}
            saveClass={handleAddClass}
        />

        <CreateClassDialog 
            open={editRoom !== null}
            classInfo={editRoom}
            subject={selected && selected.subjectId}
            options={subjects.map((subject) => ({ id: subject.subjectId.toString(), label: subject.subjectTitle }))}
            handleClose={() => setEditRoom(null)}
            saveClass={handleEditClassroom}
        />

        <LoadingOverlay open={loading} />

        <ErrorDialog open={error !== null} message={error as string} handleClose={() => setError(null)}/>

        <SuccessSnackbar open={message !== null} message={message as string} handleClose={() => setMessage(null)} />
    </>
  )
}

export default Dashboard