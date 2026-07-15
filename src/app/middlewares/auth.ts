import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
import { isUserExistVerification } from '../modules/auth/auth.utils';

const auth = (...roles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            throw new AppError(status.FORBIDDEN, 'You\'re not authorized!')
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt_access_token as string) as JwtPayload;
        } catch (error) {
            throw new AppError(status.UNAUTHORIZED, 'You\'re not authorized!');
        }

        const isUserExist = await isUserExistVerification(decoded.id);

        if (isUserExist?.passwordChangedAt) {
            const tokenIsExpired = await UserModel.isJWTIssuedBeforePasswordChanged(isUserExist?.passwordChangedAt, decoded.iat as number)
            if (tokenIsExpired) {
                throw new AppError(status.FORBIDDEN, 'You\'re not authorized!');
            }
        }

        const userRole = (decoded)?.role;
        if (roles && !roles.includes(userRole)) {
            throw new AppError(status.FORBIDDEN, 'You\'re not authorized!');
        }
        req.user = decoded;
        next();
    })
}

export default auth;