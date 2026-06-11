import { Types } from "mongoose";

export type TGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F' | 'N/A';

export type TCourseMarks = {
    CT1?: number;
    CT2?: number;
    CT3?: number;
    average?: number;
    assignment?: number;
    presentation?: number;
    attendance?: number;
    midTerm?: number;
    finalTerm?: number;
}

export type TGradePoints = {
    message: string;
    min: number;
    max: number;
    point: number;
    grade: TGrade;
}

export type TEnrolledCourse = {
    semesterRegistration: Types.ObjectId;
    academicSemester?: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    course: Types.ObjectId;
    offeredCourse: Types.ObjectId;
    faculty: Types.ObjectId;
    student: Types.ObjectId;
    isEnrolled: boolean;
    grade: TGrade;
    gradePoints: number;
    courseMarks: TCourseMarks;
    isCompleted: boolean;
}