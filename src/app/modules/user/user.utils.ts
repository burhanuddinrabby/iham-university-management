import { Types } from "mongoose";
import { TAcademicSemester } from "../academicSemester/semester.interface";
import { StudentModel } from "../student/student.model";
import { UserModel } from "./user.model";
import { USER_ROLES } from "./user.constant";

const lastStudentId = async (id: Types.ObjectId) => {
    const lastStudent = await StudentModel.findOne(
        {
            admissionSemester: id
        },
        {
            id: 1,
            _id: 0
        }
    ).sort({
        createdAt: -1
    }).lean();
    //2024011018
    //2024 01 1018
    return lastStudent?.id.substring(6) || '0';
};

export const generateStudentId = async (id: Types.ObjectId, payload: TAcademicSemester, departmentId: number): Promise<string> => {
    const currentId = await lastStudentId(id as Types.ObjectId);
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${departmentId}${incrementId}`
    return incrementId;
}

export const generateFacultyId = async (): Promise<string> => {
    //F-00001
    const lastFaculty = await UserModel.findOne(
        {
            role: USER_ROLES.faculty,
        },
        {
            id: 1,
            _id: 0
        }
    ).sort({
        createdAt: -1
    }).lean();
    const idNumber = (Number(lastFaculty?.id?.substring(2)) || 0) + 1
    const incrementId = "F-" + ((idNumber).toString().padStart(5, '0'));
    return incrementId;
};

export const generateAdminId = async (): Promise<string> => {
    //A-00001
    const lastAdmin = await UserModel.findOne(
        {
            role: USER_ROLES.admin,
        },
        {
            id: 1,
            _id: 0
        }
    ).sort({
        createdAt: -1
    }).lean();
    const idNumber = (Number(lastAdmin?.id?.substring(2)) || 0) + 1
    const incrementId = "A-" + ((idNumber).toString().padStart(5, '0'));
    return incrementId;
};