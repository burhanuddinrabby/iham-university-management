import { Types } from "mongoose";

export type TAcademicDepartment = {
    name : string;
    departmentId: number;
    academicFaculty: Types.ObjectId
}