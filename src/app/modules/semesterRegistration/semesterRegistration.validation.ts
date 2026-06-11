import z from "zod";

const createSemesterRegistration = z.object({
    body: z.object({
        academicSemester: z.string(),
        status: z.enum(['upcoming', 'ongoing', 'ended']).optional(),
        startDate: z.iso.datetime().transform((value) => new Date(value)),
        endDate: z.iso.datetime().transform((value) => new Date(value)),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    })
});
const updateSemesterRegistration = z.object({
    body: z.object({
        academicSemester: z.string().optional(),
        status: z.enum(['upcoming', 'ongoing', 'ended']).optional(),
        startDate: z.iso.datetime().transform((value) => new Date(value)).optional(),
        endDate: z.iso.datetime().transform((value) => new Date(value)).optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    })
});

export const semesterRegistrationValidations = {
    createSemesterRegistration,
    updateSemesterRegistration
}