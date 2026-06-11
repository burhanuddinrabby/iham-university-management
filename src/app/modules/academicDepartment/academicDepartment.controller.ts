import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res)=>{
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Department created successfully!!",
        data: result
    });
});

const getAllAcademicDepartments = catchAsync( async (req, res)=>{
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All Academic Departments fetched successfully!!",
        meta: result.meta,
        data: result.result
    });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Department fetched successfully!!",
        data: result
    });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic Department updated successfully!!",
        data: result
    });
});

export const AcademicDepartmentController = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}