// components
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../../hocs/AuthProvider";

const SubjectList = React.lazy(() => import("../../components/classroom/SubjectList"));
const ClassList = React.lazy(() => import("../../components/classroom/ClassList"));
const CreateSubjectDialog = React.lazy(() => import("../../components/dialogs/CreateSubject"));
const CreateClassDialog = React.lazy(() => import("../../components/dialogs/CreateClass"));
const SuccessSnackbar = React.lazy(() => import("../../components/snackbars/SuccessSnackbar"));
const LoadingOverlay = React.lazy(() => import("../../components/SuspenseLoader/LoadingOverlay"));
const ErrorDialog = React.lazy(() => import("../../components/dialogs/ErrorDialog"));

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<Subject>();
  const [createSub, setCreateSub] = useState<boolean>(false);
  const [createClass, setCreateClass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [editRoom, setEditRoom] = useState<Classroom | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const classListSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) navigate("/");
    else if (!user.teacher) navigate("/student/app");
    else setTeacherId(state => user.teacher as number);
  }, [user, navigate])

  const handleSelectSubject = (subjectId: number) => {
    setSelected(subjects.find(s => s.subjectId === subjectId));
    if (classListSection.current) window.scrollTo({
        top: classListSection.current.offsetTop,
        behavior: 'smooth',
    });
  }

  useEffect(() => {
    if (subjects.length === 0) {
        getTeacherSubjects(teacherId).then(data => {
            setSubjects(state => data);
            setSelected(state => data[0]);
            setLoading(state => false);
        })
        .catch(err => console.log(err.message));
    }
  }, [teacherId, subjects]);

  const handleAddSuject = (title: string, desc: string) => {
    setLoading(true);
    setCreateSub(false);
    createNewSubject(title, desc, teacherId).then(data => {
        setSubjects(data);
        setLoading(false);
        setMessage("Successfully added " + title);
    }).catch(err => console.log(err.message));
  }

  const handleAddClass = (subjectId: number, className: string) => {
    setLoading(true);
    setCreateClass(false);
    createNewClassroom(subjectId, className, teacherId).then(data => {
        setSubjects(data);
        setLoading(false);
        setMessage("Successfully added " + className);

        const classSub = data.find(s => s.subjectId === subjectId)
        if (classSub) setSelected(classSub);
    }).catch(err => console.log(err.message));
  }

  const handleEditSubject = (title: string, desc: string) => {
    if (editSubject) {
        setEditSubject(null);
        editSubjectData(title, desc, editSubject.subjectId, teacherId)
        .then(data => {
            setSubjects(data);
            
            const classSub = data.find(s => s.subjectId === editSubject.subjectId)
            if (classSub) setSelected(classSub);

            setMessage("Sucessfully updated " + title);
        })
        .catch(err => console.log(err.message));
    }
  }

  const handleDeleteSubject = (subjectId: number) => {
    deleteSubject(subjectId, teacherId).then(data => {
        setSubjects(data);
        setSelected(data[0]);
        setMessage("Subject was deleted sucessfully.");
    }).catch(err => setError("Cannot Delete Subject:" + (err as AxiosError).response.data.errors[0]));
  }

  const handleEditClassroom = (subjectId: number, className: string) => {
    if (editRoom) {
        setEditRoom(null);
        editClassroomData(editRoom.classroomId, className, subjectId, teacherId).then(data => {
            setSubjects(data);
            
            const classSub = data.find(s => s.subjectId === subjectId)
            if (classSub) setSelected(classSub);

            setMessage("Sucessfully updated " + className);
        }).catch(err => console.log(err.message));
    }
  } 

  const handleDeleteClassroom = (classId: number) => {
    deleteClassroom(classId, teacherId).then(data => {
        setSubjects(data);

        if (selected) {
            const classSub = data.find(s => s.subjectId === selected?.subjectId);
            if (classSub) setSelected(classSub);
        } else setSelected(data[0]);

        setMessage("Classroom was deleted sucessfully.");

    }).catch(err => {
        getTeacherSubjects(teacherId).then(data => {
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
                title={user ? "Good Day, " + user.account.firstName : "Good Day" }
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