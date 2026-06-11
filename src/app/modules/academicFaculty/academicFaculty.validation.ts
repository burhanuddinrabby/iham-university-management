import z from "zod";

const createAcademicFacultyValidation = z.object({
    body: z.object({
        name: z.string({
            error: (iss) => {
                return iss.input === undefined ? "Academic Faculty name is required" : "Academic Faculty name must be a string"
            }
        })
    })
});

export const AcademicFacultyValidations = {
    createAcademicFacultyValidation
}