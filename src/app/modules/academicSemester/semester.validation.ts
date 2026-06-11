import z from "zod";
import { months, semesterCode, semesterName } from "./semester.constants";

const createAcademicSemesterValidation = z.object({
    body: z.object({
        name: z.enum([...semesterName]),
        code: z.enum([...semesterCode]).optional(),
        year: z.string(),
        startMonth: z.enum([...months]).optional(),
        endMonth: z.enum([...months]).optional(),
    })
});


const updateAcademicSemesterValidation = z.object({
    body: z.object({
        name: z.enum([...semesterName]).optional(),
        code: z.enum([...semesterCode]).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...months]).optional(),
        endMonth: z.enum([...months]).optional(),
    })
});

export const academicSemesterValidations = {
    createAcademicSemesterValidation,
    updateAcademicSemesterValidation
}