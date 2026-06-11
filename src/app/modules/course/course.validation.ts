import z from "zod";
const prerequisiteValidation = z.object({
    courseId: z.string().optional(),
    courseCode: z.string().optional(),
    isDeleted: z.boolean().optional()
}).refine(
    (data) => {
        return data.courseId || data.courseCode;
    },
    {
        message: "Either courseId or courseCode is required",
        path: ["courseId"], // error path
    }
);
const createCourseValidation = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        courseCode: z.string().optional(),
        prerequisites: z.array(prerequisiteValidation).optional(),
        isDeleted: z.boolean().optional()
    })
});

const updateCourseValidation = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        courseCode: z.string().optional(),
        prerequisites: z.array(prerequisiteValidation).optional(),
        isDeleted: z.boolean().optional()
    })
});
const courseFacultyValidation = z.object({
    body: z.object({
        faculties: z.array(z.string()),
    }),
});
export const CourseValidations = {
    createCourseValidation,
    updateCourseValidation,
    courseFacultyValidation
}