import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course is created Successfully!!',
        data: result
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course is updated Successfully!!',
        data: result
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req?.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Courses retrieved Successfully!!',
        meta: result.meta,
        data: result.result
    });
});

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course retrieved Successfully!!',
        data: result
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course deleted Successfully!!',
        data: result
    });
});

const assignFaculties = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.assignCourseFacultiesIntoDB(id, req?.body?.faculties);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course teacher assigned successfully!!',
        data: result
    });
});

const removeFaculties = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.removeCourseFacultiesFromDB(id, req?.body?.faculties);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course teacher removed successfully!!',
        data: result
    });
});

const getFacultiesWithCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getFacultiesWithCourseFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties retrieved successfully',
        data: result,
    });
});
export const CourseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    assignFaculties,
    removeFaculties,
    getFacultiesWithCourse
}