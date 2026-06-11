import { model, Schema } from "mongoose";
import { AuthUserModel, TUser } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";

const userSchema = new Schema<TUser, AuthUserModel>({
    id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    email: {
        type: String,
        unique: [true, "Email already exists!!!"],
        required: [true, "email de bc"],
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['superAdmin', 'student', 'faculty', 'admin']
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
//hashing the password using pre save middleware
userSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(this?.password, Number(config.bcrypt_salt_round));

    next();
})

userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isUserExistById = async function (id: string) {
    return await this.findOne({ id }).select('+password');
}

userSchema.statics.isPasswordMatched = async function (plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (passwordChangedTime: Date, jwtIssuedTime: number) {
    const passChangeTimeInMS = new Date(passwordChangedTime).getTime() / 1000;
    return passChangeTimeInMS > jwtIssuedTime;
}

export const UserModel = model<TUser, AuthUserModel>('User', userSchema);