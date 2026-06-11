import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.services";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req?.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester registered successfully!',
        data: result,
    });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All registered semesters fetched successfully!',
        meta: result.meta,
        data: result.result
    });
});
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester fetched successfully!',
        data: result,
    });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester updated successfully!',
        data: result,
    });
})

const deleteSemesterRegistration = catchAsync(async(req, res) => {
    const result = await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(req.params.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester registration deleted successfully!',
        data: result,
    });
});
export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
}