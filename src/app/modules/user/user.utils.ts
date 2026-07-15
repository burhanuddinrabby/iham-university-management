import { Types } from "mongoose";
import { TAcademicSemester } from "../academicSemester/semester.interface";
import { StudentModel } from "../student/student.model";
import { UserModel } from "./user.model";
import { USER_ROLES } from "./user.constant";

const lastStudentId = async (id: Types.ObjectId, deptId: Types.ObjectId) => {
    const lastStudent = await StudentModel.findOne(
        {
            admissionSemester: id,
            academicDepartment: deptId
        },
        {
            id: 1,
            _id: 0
        }
    ).sort({
        createdAt: -1
    }).lean();
    //263-12-0001
    const lastDigits: string = lastStudent?.id?.split('-')[2] || '0000';
    return lastDigits;
};

export const generateStudentId = async (id: Types.ObjectId, payload: TAcademicSemester, departmentCustomId: number, deptId: Types.ObjectId): Promise<string> => {
    const currentId = await lastStudentId(id, deptId);
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    console.log(incrementId)
    incrementId = `${payload.year.substring(2)}${payload.code.substring(1)}-${departmentCustomId}-${incrementId}`
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