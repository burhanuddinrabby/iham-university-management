import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);
    const { refreshToken, ...rest } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
        // sameSite: 'none',
        // maxAge: 1000 * 60 * 60 * 24 * 365
    });

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Logged in successfully!',
        data: rest
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req?.cookies?.refreshToken);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Token refreshed successfully!',
        data: result
    })
})

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password changed successfully!',
        data: result
    })
})

const forgetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.forgetPassword(req.body.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Reset password link generated successfully!',
        data: result
    })
})

const resetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.resetPassword(req.headers.authorization?.split(' ')[1] as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password reset successful!',
        data: result
    })
})
export const AuthController = {
    login,
    refreshToken,
    changePassword,
    resetPassword,
    forgetPassword
} 