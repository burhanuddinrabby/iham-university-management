import { Model, Types } from "mongoose";
import { TUsername } from "../student/student.interface";

export type TAdmin = {
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
    profileImg?: string;
    isDeleted: boolean;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
}
export interface TAdminModel extends Model<TAdmin> {
    isUserExists(id: string): Promise<TAdmin | null>;
}