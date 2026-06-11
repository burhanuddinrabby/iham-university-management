import z from "zod";

const createAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({
            error: (iss) => {
                return iss.input === undefined ? "Academic Department name is required" : "Academic Department name must be a string"
            }
        }),
        academicFaculty: z.string({
            error: "Academic Faculty field is required to create new department"
        })
    })
});

const updateAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({
            error:  "Academic Department name must be a string"
        }).optional(),
        academicFaculty: z.string({
            error: "Academic Faculty field is required to create new department"
        }).optional()
    })
});

export const AcademicDepartmentValidations = {
    createAcademicDepartmentValidation,
    updateAcademicDepartmentValidation
}