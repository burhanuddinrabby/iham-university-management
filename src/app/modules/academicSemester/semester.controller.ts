import sendResponse from "../../utils/sentResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./semester.service";
import { TAcademicSemester } from "./semester.interface";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createSemesterIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'New semester is created successfully!',
        data: result,
    });
});

const getAllSemesters = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllSemestersFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Academic Semesters Fetched Successfully!',
        meta: result.meta,
        data: result.result
    });
});

const getSingleSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getSingleSemestersFromDB(req.params.id);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Semester Fetched Successfully!',
        data: result
    });
});

const updateSemester = catchAsync( async (req, res) => {
    const result = await AcademicSemesterServices.updateSemesterIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester Updated Successfully!',
        data: result
    });
});

export const AcademicSemesterController = {
    createAcademicSemester,
    getAllSemesters,
    getSingleSemester,
    updateSemester
}