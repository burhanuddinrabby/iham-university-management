import { UserServices } from "./user.service";
import sendResponse from "../../utils/sentResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;
    // console.log(password, student)
    const result = await UserServices.createStudentIntoDB(req?.file, password, student);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is created successfully',
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body;
    const result = await UserServices.createFacultyIntoDB(req?.file, password, faculty);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty is created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body;
    const result = await UserServices.createAdminIntoDB(req?.file, password, admin);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin is created successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const result = await UserServices.getMeFromDB(req.user as JwtPayload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Data retrieved successfully',
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const result = await UserServices.changeStatusOfUser(req?.params?.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User status changed successfully!',
        data: result,
    });
});

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
}