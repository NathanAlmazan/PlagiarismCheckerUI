import axios from 'axios';
import deleteFile from "./FirebaseServices/storage";
import { Assignment, Classroom, FileStorage, Subject } from "./base";

export type DocumentCompare = {
    cosineDistance: number,
    similarSentences: string[],
    source?: FileStorage
};

type PlainResponse = {
    status: number,
    message: string
}

export type AccountData = {
    account_uid: string;
    firstName: string;
    lastName: string;
    email: string;
    provider: string;
    accountType: string;
    teacher: {
        teacherId: number;
    } | null;
    student: {
        studentId: number;
    } | null;
}

export async function getAccountData(uid: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/find/${uid}`, config);
    return response.data as AccountData;
}

export async function getAssignmentDate(classCode: string, assignId: number) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/class/assignment/${classCode}/${assignId}`, config);
    return response.data as Assignment;
}

export async function submitPDF(file: File, assignId: number): Promise<FileStorage> {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignId", assignId.toString());

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/file/extract`, formData, config);
    const newFile: FileStorage = response.data;

    return newFile;
}

async function getDocumentDistance(documentId: number, assignId: number, excludeDocuments: number[]): Promise<FileStorage> {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ documentId, assignId, excludeDocuments });

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/analyze`, body, config);
    const result: FileStorage = response.data;

    return result;
}

export async function getDocumentComparison(documentA: number, documentB: number): Promise<DocumentCompare> {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ documentA, documentB });

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/compare`, body, config);
    const comparison: DocumentCompare = response.data;

    return comparison;
}

export async function getFilePlainContent(file: File): Promise<PlainResponse> {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/file/content`, formData, config);
    const content: PlainResponse = response.data;

    return content;
}

export async function deleteDocument(fileId: number, uid: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    await axios.get(`${process.env.REACT_APP_API_URL}/analyzer/file/delete/${fileId}`, config);
    await deleteFile(uid);
}

export async function analyzeDocument(documentId: number, assignId: number): Promise<DocumentCompare | null> {
    let excludeDocuments: number[] = [ documentId ];

    for (let x = 0; x < 2; x++) {
        const cosineDistance = await getDocumentDistance(documentId, assignId, excludeDocuments);
        //console.log(cosineDistance);
        if (!cosineDistance.file_id) return null;
        const comparison = await getDocumentComparison(documentId, cosineDistance.file_id);
        //console.log(comparison);

        if (comparison.similarSentences.length > 1) {
            comparison.source = cosineDistance;
            return comparison;
        } else {
            excludeDocuments.push(cosineDistance.file_id);
        }
    }

    return null;
}

export async function saveAssignment(studentId: number, assignId: number, fileId: number) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ studentId, assignId, fileId });
    await axios.post(`${process.env.REACT_APP_API_URL}/class/assignment/submit`, body, config);
}

export async function getTeacherSubjects(teacherId: number): Promise<Subject[]> {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/class/subject/find/${teacherId}`, config);
    return response.data as Subject[];
}

export async function getClassroomData(classCode: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/class/room/data/${classCode}`, config);
    return response.data as Classroom;
}

export async function getFileStorageData(fileUid: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/analyzer/file/storage/${fileUid}`, config);
    return response.data as FileStorage;
}

export async function getFileContentFromURL(fileUid: string) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/analyzer/file/content/${fileUid}`, config);
    return response.data as PlainResponse;
}

export type ClassroomData = {
    classroomId: number;
    classroomCode: string;
    classroomName: string;
    classSubject: {
        subjectName: string;
        teacherName: string;
    }
}

export async function getStudentClassrooms(studentId: number) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/class/room/find/${studentId}`, config);
    return response.data as ClassroomData[];
}

export async function getStudentAssignments(studentId: number) {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/class/assignment/student/${studentId}`, config);
    return response.data as number[];
}