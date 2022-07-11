import axios from "axios";
import { Assignment } from "./base";
import { getClassroomData, getTeacherSubjects, getStudentClassrooms } from "./GetRequests";

export async function createStudentAccount(uid: string, name: string, email: string, level?: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        accountUid: uid,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        email: email,
        provider: "EmailPass",
        level: level ? level : "HS"
    });

    await axios.post(`${process.env.REACT_APP_API_URL}/accounts/student/create`, body, config);
}

export async function createTeacherAccount(uid: string, name: string, email: string, school?: string, specialization?: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        accountUid: uid,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        email: email,
        provider: "EmailPass",
        school: school ? school : "NONE",
        specialization: specialization ? specialization : "NONE"
    });

    await axios.post(`${process.env.REACT_APP_API_URL}/accounts/teacher/create`, body, config);
}

export async function createNewSubject(subjectTitle: string, subjectDescription: string, teacherId: number) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ subjectTitle, subjectDescription, teacherId });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/subject/create`, body, config);

    return await getTeacherSubjects(teacherId);
}

export async function createNewClassroom(subjectId: number, className: string, teacherId: number) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ subjectId, className });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/room/create`, body, config);

    return await getTeacherSubjects(teacherId);
}

export async function editSubjectData(subjectTitle: string, subjectDescription: string, subjectId: number, teacherId: number) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ subjectId, subjectTitle, subjectDescription });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/subject/edit`, body, config);

    return await getTeacherSubjects(teacherId);
}

export async function deleteSubject(subjectId: number, teacherId: number) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    await axios.get(`${process.env.REACT_APP_API_URL}/class/subject/delete/${subjectId}`, config);

    return await getTeacherSubjects(teacherId);
}

export async function editClassroomData(classId: number, className: string, subjectId: number, teacherId: number) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ classId, className, subjectId });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/room/edit`, body, config);

    return await getTeacherSubjects(teacherId);
}

export async function deleteClassroom(classId: number, teacherId: number) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    await axios.get(`${process.env.REACT_APP_API_URL}/class/room/remove/${classId}`, config);

    return await getTeacherSubjects(teacherId);
}


export async function createNewAssignment(assignment: Assignment, classId: number, classCode: string) {
    const { assignTitle, assignDesc, assignDueDate, assignDueTime, assignPoints } = assignment;
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ classId, assignTitle, assignDesc, assignDueDate, assignDueTime, assignPoints });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/assignment/create`, body, config);

    return await getClassroomData(classCode);
}

export async function editAssignmentData(assignment: Assignment, classId: number, classCode: string) {
    const { assignmentId, assignTitle, assignDesc, assignDueDate, assignDueTime, assignPoints } = assignment;
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ assignmentId, classId, assignTitle, assignDesc, assignDueDate, assignDueTime, assignPoints });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/assignment/update`, body, config);

    return await getClassroomData(classCode);
}

export async function deleteAssignmentData(assignId: number, classCode: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    await axios.get(`${process.env.REACT_APP_API_URL}/class/assignment/delete/${assignId}`, config);

    return await getClassroomData(classCode);
}

export async function enrollStudentToClass(studentId: number, classCode: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ studentId, classCode });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/room/enroll`, body, config);

    return await getStudentClassrooms(studentId);
}