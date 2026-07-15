import mongoose from "mongoose";
import config from "../../config";
import { TAcademicSemester } from "../academicSemester/semester.interface";
import { AcademicSemesterModel } from "../academicSemester/semester.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { FacultyModel } from "../faculty/faculty.model";
import { AdminModel } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";
import { Types } from 'mongoose';
import { JwtPayload } from "jsonwebtoken";
import { uploadImageToCloudinary } from "../../utils/uploadImage";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { USER_ROLES } from "./user.constant";

const createStudentIntoDB = async (file: any, password: string, studentData: TStudent) => {
    const userData: Partial<TUser> = {}

    //if pass not given and set role
    userData.password = password || (config.default_password as string);
    userData.needsPasswordChange = password ? false : true;
    userData.role = USER_ROLES.student;
    userData.email = studentData.email;

    //find academic semester info
    const admissionSemester = await AcademicSemesterModel.findOne({
        _id: studentData.admissionSemester
    });

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const academicDepartment = await AcademicDepartmentModel.findById(studentData.academicDepartment);
        userData.id = await generateStudentId(studentData.admissionSemester as Types.ObjectId, admissionSemester as TAcademicSemester, academicDepartment?.departmentId as number, studentData.academicDepartment);
        //create a user
        // transaction 1
        const newUser = await UserModel.create([userData], { session });

        //create student
        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }
        //set id = _id
        studentData.id = newUser[0].id;
        studentData.user = newUser[0]._id;

        //setup profile image
        if (file) {
            const imgName = `${studentData?.name?.firstName}-${studentData.id}-img`;
            const filePath = file?.path;
            const image = await uploadImageToCloudinary(imgName, filePath);
            studentData.profileImg = image?.secure_url;
        } else {
            studentData.profileImg = studentData?.profileImg || '';
        }
        //check department
        if (!academicDepartment)
            throw new AppError(status.NOT_FOUND, 'Academic Department Not Found');

        studentData.academicFaculty = academicDepartment.academicFaculty;


        // transaction 2
        const newStudent = await StudentModel.create([studentData], { session });

        if (!newStudent.length) {
            throw new AppError(status.BAD_REQUEST, "Failed to create new student!");
        }
        await session.commitTransaction();
        await session.endSession();

        return newStudent;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // console.log(error);
        throw new AppError(status.BAD_REQUEST, error as string);
    }

};

const createFacultyIntoDB = async (file: any, password: string, facultyData: TFaculty) => {
    const userData: Partial<TUser> = {}

    //if pass not given and set role
    userData.password = password || (config.default_password as string);
    userData.needsPasswordChange = password ? false : true;
    userData.role = USER_ROLES.faculty;
    userData.email = facultyData.email;

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        userData.id = await generateFacultyId();
        //create a user
        // transaction 1
        const newUser = await UserModel.create([userData], { session });

        //create student
        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }
        //set id = _id
        facultyData.id = newUser[0].id;
        facultyData.user = newUser[0]._id;

        //setup profile image
        if (file) {
            const imgName = `${facultyData?.name?.firstName}-${facultyData.id}-img`;
            const filePath = file?.path;
            const image = await uploadImageToCloudinary(imgName, filePath);
            facultyData.profileImg = image?.secure_url;
        } else {
            facultyData.profileImg = facultyData?.profileImg || '';
        }

        //check department
        const academicDepartment = await AcademicDepartmentModel.findById(facultyData.academicDepartment);
        if (!academicDepartment)
            throw new AppError(status.NOT_FOUND, 'Academic Department Not Found');

        facultyData.academicFaculty = academicDepartment.academicFaculty;
        // transaction 2
        const newFaculty = await FacultyModel.create([facultyData], { session });

        if (!newFaculty.length) {
            throw new AppError(status.BAD_REQUEST, "Failed to create new faculty!");
        }
        await session.commitTransaction();
        await session.endSession();
        return newFaculty;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // console.log(error);
        throw new AppError(status.BAD_REQUEST, error as string);
    }

};

const createAdminIntoDB = async (file: any, password: string, adminData: TAdmin) => {
    const userData: Partial<TUser> = {}

    //if pass not given and set role
    userData.password = password || (config.default_password as string);
    userData.needsPasswordChange = password ? false : true;
    userData.role = USER_ROLES.admin;
    userData.email = adminData.email;

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        userData.id = await generateAdminId();
        //create a user
        // transaction 1
        const newUser = await UserModel.create([userData], { session });

        //create student
        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }
        //set id = _id
        adminData.id = newUser[0].id;
        adminData.user = newUser[0]._id;
        //setup profile image
        if (file) {
            const imgName = `${adminData?.name?.firstName}-${adminData.id}-img`;
            const filePath = file?.path;
            const image = await uploadImageToCloudinary(imgName, filePath);
            adminData.profileImg = image?.secure_url;
        } else {
            adminData.profileImg = adminData?.profileImg || '';
        }
        // transaction 2
        const newAdmin = await AdminModel.create([adminData], { session });

        if (!newAdmin.length) {
            throw new AppError(status.BAD_REQUEST, "Failed to create new admin!");
        }
        await session.commitTransaction();
        await session.endSession();
        return newAdmin;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, error as string);
    }

};

const getMeFromDB = async (user: JwtPayload) => {

    if (user?.role === USER_ROLES.student) {
        return await StudentModel.findOne({ id: user.id }).populate('admissionSemester').populate('academicDepartment').populate('user');
    }
    if (user?.role === USER_ROLES.faculty) {
        return await FacultyModel.findOne({ id: user.id }).populate('academicDepartment').populate('user');
    }
    if (user?.role === USER_ROLES.admin) {
        return await AdminModel.findOne({ id: user.id }).populate('user');
    }
    throw new AppError(status.BAD_REQUEST, "Seems something went wrong!!");
};


const changeStatusOfUser = async (id: string, payload: { status: string }) => {
    const result = await UserModel.findOneAndUpdate({ id }, payload, { new: true });
    return result;
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMeFromDB,
    changeStatusOfUser
}