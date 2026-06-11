import z from "zod";
import { Days } from "./offeredCourse.constants";

const timeStringValidation = z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //HH:MM  00-23:00-59 
    return regex.test(time);
}, {
    message: 'Invalid time format, expected HH:MM'
})

const createOfferedCourseValidation = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        // academicSemester: z.string(), //not from frontend
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        course: z.string(),
        faculty: z.string(),
        maxCapacity: z.number(),
        section: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringValidation,
        endTime: timeStringValidation,
    }).refine((body) => {
        //startTime should be less than endTime
        //refine time as a date string
        //start 8:30
        //end 10:00
        // 2000-01-01T08:30:00
        // 2000-01-01T10:00:00
        const start = new Date(`2000-01-01T${body.startTime}:00`);
        const end = new Date(`2000-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: 'End time should be after start time'
    })
});

const updateOfferedCourseValidation = z.object({
    body: z.object({
        faculty: z.string(),
        maxCapacity: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringValidation,
        endTime: timeStringValidation,
    }).refine((body) => {
        const start = new Date(`2000-01-01T${body.startTime}:00`);
        const end = new Date(`2000-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: 'End time should be after start time'
    })
});
export const offeredCourseValidations = {
    createOfferedCourseValidation,
    updateOfferedCourseValidation
}