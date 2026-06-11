import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";
import { UserModel } from "../user/user.model";
import AppError from "../../errors/AppError";
import status from "http-status";

export const createToken = (jwtPayload: { id: string, role: string },
    secret: string,
    expiresIn: SignOptions["expiresIn"]
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn
    })
}

export const isUserExistVerification = async(id: string) => {
    const user = await UserModel.isUserExistById(id)

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found with this id!');
    }
    if (user?.isDeleted) {
        throw new AppError(status.FORBIDDEN, 'User with this id is already deleted!');
    }
    if (user?.status === 'blocked') {
        throw new AppError(status.FORBIDDEN, 'Can\'t access this user!');
    }
    return user;
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload;
}