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