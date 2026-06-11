import { Model, Types } from "mongoose";
import { TUsername } from "../student/student.interface";

export type TFaculty = {
    id: string;
    user: Types.ObjectId;
    name: TUsername;
    designation: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    profileImg?: string;
    isDeleted: boolean;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
}
export interface TFacultyModel extends Model<TFaculty> {
    isUserExists(id: string): Promise<TFaculty | null>;
}