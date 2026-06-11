import z from "zod";
const userNameValidation = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
});
const userNameUpdateValidation = z.object({
    firstName: z.string().min(1).optional(),
    middleName: z.string().optional(),
    lastName: z.string().min(1).optional(),
});
export const createAdminValidation = z.object({
    body: z.object({
        password: z.string().min(8, "Password must be minimum 8 characters").optional(),
        admin: z.object({
            name: userNameValidation,
            designation: z.string().min(1, "Designation is required"),
            gender: z.enum(["male", "female", "other"], "Invalid gender"),
            dateOfBirth: z.string().optional(),
            email: z.email("Invalid email address").min(1, "Email is required"),
            contactNo: z.string().min(1, "Contact number is required"),
            emergencyContactNo: z.string().min(1, "Emergency contact number is required"),
            presentAddress: z.string().min(1, "Present address is required"),
            permanentAddress: z.string().min(1, "Permanent address is required"),
            profileImg: z.url("Invalid URL").optional(),
            bloodGroup: z
                .enum(["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"])
                .optional(),
        })
    })
});

export const updateAdminValidation = z.object({
    body: z.object({
        admin: z.object({
            name: userNameUpdateValidation.optional(),
            designation: z.string().optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            profileImg: z.string().optional(),
            bloodGroup: z
                .enum(["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"])
                .optional(),
        }).optional()
    })
});

export const AdminValidation = {
    createAdminValidation,
    updateAdminValidation
}