import status from "http-status"
import AppError from "../../errors/AppError"
import { UserModel } from "../user/user.model"
import { TLogInUser } from "./auth.interface"
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from "../../config";
import bcrypt from 'bcrypt';
import { createToken, isUserExistVerification, verifyToken } from "./auth.utils";
import { sendMail } from "../../utils/sendMail";

const login = async (payload: TLogInUser) => {
    const isUserExist = await isUserExistVerification(payload.id);

    //check valid password
    const isValid = await UserModel.isPasswordMatched(payload.password, isUserExist.password);
    if (!isValid) {
        throw new AppError(status.FORBIDDEN, 'Wrong password!');
    }

    const jwtPayload = {
        id: isUserExist.id,
        role: isUserExist.role
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_token as string, config.jwt_access_token_exp as SignOptions["expiresIn"]);
    // jwt.sign(
    //     jwtPayload,
    //     config.jwt_access_token as string,
    //     {
    //         expiresIn: '100D',
    //     },
    // );

    const refreshToken = createToken(jwtPayload, config.jwt_refresh_token as string, config.jwt_refresh_token_exp as SignOptions["expiresIn"]);;

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: isUserExist.needsPasswordChange
    }
}

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_token as string);

    const isUserExist = await isUserExistVerification(decoded.id);
    
    if (isUserExist?.passwordChangedAt) {
        const tokenIsExpired = await UserModel.isJWTIssuedBeforePasswordChanged(isUserExist?.passwordChangedAt, decoded.iat as number)
        if (tokenIsExpired) {
            throw new AppError(status.FORBIDDEN, 'You\'re not authorized!');
        }
    }

    const jwtPayload = {
        id: isUserExist.id,
        role: isUserExist.role
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_token as string, config.jwt_access_token_exp as SignOptions["expiresIn"]);

    return { accessToken }
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
    const isUserExist = await isUserExistVerification(userData.id);

    //check valid password
    const isValid = await UserModel.isPasswordMatched(payload.oldPassword, isUserExist.password);
    if (!isValid) {
        throw new AppError(status.FORBIDDEN, 'Old password is incorrect!');
    }

    const newHashedPass = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));

    // const result = 
    await UserModel.findOneAndUpdate(
        {
            id: userData.id,
            role: userData.role
        },
        {
            password: newHashedPass,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        },
        {
            new: true
        }
    );
    return null;
}
const forgetPassword = async (id: string) => {
    const isUserExist = await isUserExistVerification(id);

    const jwtPayload = {
        id: isUserExist.id,
        role: isUserExist.role
    }
    const resetToken = createToken(jwtPayload, config.jwt_access_token as string, '10m' as SignOptions["expiresIn"]);

    const resetLink = `${config.reset_ui_link}?id=${isUserExist.id}&token=${resetToken}`
    sendMail(isUserExist.email, resetLink);
    return null;
}
const resetPassword = async (token: string, payload: {
    id: string,
    newPassword: string
}) => {
    if (!token) {
        throw new AppError(status.FORBIDDEN, 'You\'re not authorized!')
    }

    const decoded = verifyToken(token, config.jwt_access_token as string);
    if (decoded.id !== payload.id) {
        throw new AppError(status.FORBIDDEN, 'Invalid id for password reset operation!')
    }
    //check if the token is only for 10 minutes
    const forgetPassTokenValidationInMinutes = ((decoded?.exp as number) - (decoded?.iat as number)) / 60;
    if (forgetPassTokenValidationInMinutes !== 10) {
        throw new AppError(status.FORBIDDEN, 'Your token is not what we sent you!')
    }
    const newHashedPass = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
    // const result = 
    await UserModel.findOneAndUpdate(
        {
            id: decoded.id,
        },
        {
            password: newHashedPass,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        },
        {
            new: true
        }
    );
    return null;
}

export const AuthServices = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
}