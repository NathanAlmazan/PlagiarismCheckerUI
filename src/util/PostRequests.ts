import axios from "axios";
import { getTeacherSubjects } from "./GetRequests";

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