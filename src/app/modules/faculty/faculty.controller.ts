import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculties = catchAsync(async (req, res) => {
    // console.log(req.cookies);
    const result = await FacultyServices.getAllFacultiesFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties fetched successfully',
        meta: result.meta,
        data: result.result
    })
});
const getSingleFaculty = catchAsync(async (req, res) => {
    const facultyID = req.params.facultyID;

    const result = await FacultyServices.getSingleFacultyFromDB(facultyID);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty fetched successfully',
        data: result,
    })

});
const deleteFaculty = catchAsync(async (req, res) => {
    const FacultyID = req.params.facultyID;

    const result = await FacultyServices.deleteFacultyFromDB(FacultyID);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty deleted successfully',
        data: result,
    })
});

const updateFaculty = catchAsync(async (req, res) => {
    const id = req.params.facultyID;

    const result = await FacultyServices.updateFacultyIntoDB(id, req.body.faculty);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Faculty updated successfully!!",
        data: result
    });
})
export const FacultyController = {
    getAllFaculties,
    getSingleFaculty,
    deleteFaculty,
    updateFaculty
}