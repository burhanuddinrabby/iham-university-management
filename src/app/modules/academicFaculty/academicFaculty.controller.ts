import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res)=>{
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Faculty created successfully!!",
        data: result
    });
});

const getAllAcademicFaculty = catchAsync( async (req, res)=>{
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB(req.query);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All Academic Faculties fetched successfully!!",
        meta: result.meta,
        data: result.result
    });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Faculty fetched successfully!!",
        data: result
    });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Faculty updated successfully!!",
        data: result
    });
});

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}