import { Types } from "mongoose";

export type TPrerequisites = {
    course: string;
    isDeleted?: boolean;
}

export type TCourse = {
    title: string;
    prefix: string;
    code: number;
    credits: number;
    courseCode: string;
    prerequisites: TPrerequisites[];
    isDeleted?: boolean;
}

export type TPrerequisitesPayload = {
    courseId?: string;
    courseCode?: string;
    isDeleted?: boolean;
}
export type TCoursePayload = {
    title: string;
    prefix: string;
    code: number;
    credits: number;
    courseCode: string;
    prerequisites: TPrerequisitesPayload[];
    isDeleted?: boolean;
}

export type TCourseFaculty = {
    course: Types.ObjectId;
    faculties: Types.ObjectId[];
}