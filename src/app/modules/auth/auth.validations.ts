import z from "zod";

const loginValidation = z.object({
    body: z.object({
        id: z.string().min(1, 'Id is required'),
        password: z.string().min(1, 'Password is required')
    })
});
const refreshTokenValidation = z.object({
    cookies: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    })
});
const changePassValidation = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Old password is required'),
        newPassword: z.string().min(1, 'New password is required'),
    })
});
const forgetPassValidation = z.object({
    body: z.object({
        id: z.string().min(1, 'User id is required'),
    })
});
const resetPassValidation = z.object({
    body: z.object({
        id: z.string().min(1, 'User id is required'),
        newPassword: z.string().min(1, 'New password is required'),
    })
});

export const AuthValidations = {
    loginValidation,
    refreshTokenValidation,
    changePassValidation,
    resetPassValidation,
    forgetPassValidation
}