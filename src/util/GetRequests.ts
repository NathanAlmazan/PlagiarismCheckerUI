import axios from 'axios';
import deleteFile from "./FirebaseServices/storage";

export type DocumentCompare = {
    cosineDistance: number,
    similarTerms: string[],
    sentencesA: string[],
    sentencesB: string[],
    source?: string
};

export type FileStorage = {
    file_id: number,
    fileName: string,
    fileUid: string,
    originalFileLink: string,
    renderedFileLink: string,
    originalityScore: number
}

type PlainResponse = {
    status: number,
    message: string
}

export async function submitPDF(file: File): Promise<FileStorage> {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/file/extract`, formData, config);
    const newFile: FileStorage = response.data;

    return newFile;
}

async function getDocumentDistance(documentId: number, excludeDocuments: number[]): Promise<FileStorage> {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ documentId, excludeDocuments });

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyzer/analyze`, body, config);
    const result: FileStorage = response.data;

    return result;
}

async function getDocumentComparison(documentA: number, documentB: number): Promise<DocumentCompare> {
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

export async function analyzeDocument(documentId: number): Promise<DocumentCompare | null> {
    let excludeDocuments: number[] = [ documentId ];

    for (let x = 0; x < 3; x++) {
        const cosineDistance = await getDocumentDistance(documentId, excludeDocuments);
        const comparison = await getDocumentComparison(documentId, cosineDistance.file_id);

        if (comparison.sentencesA.length > 0 && comparison.sentencesB.length > 0) {
            comparison.source = cosineDistance.fileName;
            return comparison;
        } else {
            excludeDocuments.push(cosineDistance.file_id);
        }
    }

    return null;
}