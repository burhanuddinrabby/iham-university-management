import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import status from "http-status";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course created successfully!!',
        data: result
    });
});
const getAllOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.getAllOfferedCourseFrom(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All offered Courses fetched successfully!!',
        meta: result.meta,
        data: result.result
    });
});
const getSingleOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.getSingleOfferedCourseFrom(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course fetched successfully!!',
        data: result
    });
});
const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course updated successfully!!',
        data: result
    });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course deleted successfully!!',
        data: result
    });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
    const studentId = req.user.id;
    const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(studentId, req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Your offered courses fetched successfully!!',
        data: result
    });
});

export const OfferedCourseController = {
    createOfferedCourse,
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
    getMyOfferedCourses
}