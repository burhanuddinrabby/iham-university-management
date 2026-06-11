import z from "zod";

const createEnrolledCourseValidation = z.object({
    body: z.object({
        offeredCourse: z.string()
    })
});

const updateEnrolledCourseMarksValidations = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        offeredCourse: z.string(),
        student: z.string(),
        // grade: z.string().optional(),
        // gradePoints: z.number().optional(),
        courseMarks: z.object({
            CT1: z.number().optional(),
            CT2: z.number().optional(),
            CT3: z.number().optional(),
            assignment: z.number().optional(),
            presentation: z.number().optional(),
            attendance: z.number().optional(),
            midTerm: z.number().optional(),
            finalTerm: z.number().optional(),
        })
    })
})

export const enrolledCourseValidations = {
    createEnrolledCourseValidation,
    updateEnrolledCourseMarksValidations,
}