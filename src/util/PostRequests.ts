import axios from "axios";
import { Assignment } from "./base";
import { getClassroomData, getTeacherSubjects } from "./GetRequests";

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