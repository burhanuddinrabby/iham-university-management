import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AdminServices } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admins fetched successfully',
        meta: result.meta,
        data: result.result
    })
});
const getSingleAdmin = catchAsync(async (req, res) => {
    const adminID = req.params.adminID;

    const result = await AdminServices.getSingleAdminFromDB(adminID);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin fetched successfully',
        data: result,
    })

});
const deleteAdmin = catchAsync(async (req, res) => {
    const adminID = req.params.adminID;

    const result = await AdminServices.deleteAdminFromDB(adminID);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin deleted successfully',
        data: result,
    })
});

const updateAdmin = catchAsync(async (req, res) => {
    const id = req.params.adminID;

    const result = await AdminServices.updateAdminIntoDB(id, req.body.admin);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin updated successfully!!",
        data: result
    });
})
export const AdminController = {
    getAllAdmins,
    getSingleAdmin,
    deleteAdmin,
    updateAdmin
}