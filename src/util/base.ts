export type Subject = {
    subjectId: number,
    subjectTitle: string,
    subjectDescription: string,
    classrooms: Classroom[]
}

export type Classroom = {
    classroomId: number,
    classroomCode: string,
    classroomName: string,
    dateCreated: string,
    enrolledStudents: Student[],
    assignments: ClassAssignment[]
}

export type Student = {
    studentId: number,
    level: string
}

export type Assignment = {
    assignmentId: number,
    assignTitle: string,
    assignDesc: string,
    assignPoints: number,
    assignDueDate: string,
    assignDueTime: string,
}

export type ClassAssignment = {
    assignmentId: number,
    assignTitle: string,
    assignDesc: string,
    assignPoints: number,
    assignDueDate: string,
    assignDueTime: string,
    submittedFiles: FileStorage[]
}

export type AxiosError = {
    response: {
        config: unknown,
        data: {
            errors: string[],
            status: number,
            timestamp: string
        }
    }
}

export type FileStorage = {
    file_id: number,
    fileName: string,
    fileUid: string,
    originalFileLink: string,
    originalityScore: number,
    dateUploaded: string,
    assignmentList: {
        student: {
            studentId: number, 
            level: string,
            studentAccount: {
                firstName: string,
                lastName: string,
                email: string
            }
        }
    } | null
}