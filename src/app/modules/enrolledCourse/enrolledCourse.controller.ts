import status from "http-status";
import sendResponse from "../../utils/sentResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";
import catchAsync from "../../utils/catchAsync";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(req.user.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course enrolled successfully!!',
        data: result
    });
});

const updateEnrolledCourse = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.updateEnrolledCourseIntoDB(req.user.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Marks updated successfully!!',
        data: result
    });
});

const getMyEnrolledCourse = catchAsync(async (req, res) => {
    const studentId = req.user.id;
    const result = await EnrolledCourseServices.getMyEnrolledCourseFromDB(studentId, req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully!!',
        meta: result.meta,
        data: result.result
    });
});

export const EnrolledCourseController = {
    createEnrolledCourse,
    updateEnrolledCourse,
    getMyEnrolledCourse
}