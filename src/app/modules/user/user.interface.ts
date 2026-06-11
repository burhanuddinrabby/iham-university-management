import { Model } from "mongoose";
import { USER_ROLES } from "./user.constant";

export interface TUser {
    id: string;
    password: string;
    email: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: 'superAdmin' | 'admin' | 'student' | 'faculty';
    status: 'blocked' | 'in-progress';
    isDeleted: boolean
}
export type TUserRole = keyof typeof USER_ROLES;

export interface AuthUserModel extends Model<TUser> {
    isUserExistById(id: string): Promise<TUser>;
    isPasswordMatched(plain: string, hash: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(passwordChangedTime: Date, jwtIssuedTime: number): Promise<boolean>
}