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
    assignments: Assignment[]
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
    assignDueTime: string
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