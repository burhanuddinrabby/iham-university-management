import mongoose, { Schema } from "mongoose";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";
import { Grades } from "./enrolledCourse.constants";

const courseMarksSchema = new Schema<TCourseMarks>({
    CT1: {
        type: Number,
        min: 0,
        max: 15,
        default: 0
    },
    CT2: {
        type: Number,
        min: 0,
        max: 15,
        default: 0
    },
    CT3: {
        type: Number,
        min: 0,
        max: 15,
        default: 0
    },
    average: {
        type: Number,
        min: 0,
        max: 15,
        default: 0
    },
    assignment: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    attendance: {
        type: Number,
        min: 0,
        max: 7,
        default: 0
    },
    presentation: {
        type: Number,
        min: 0,
        max: 8,
        default: 0
    },
    midTerm: {
        type: Number,
        min: 0,
        max: 25,
        default: 0
    },
    finalTerm: {
        type: Number,
        min: 0,
        max: 40,
        default: 0
    },
})

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
    semesterRegistration: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'SemesterRegistration'
    },
    academicSemester: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Semester'
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicFaculty'
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicDepartment'
    },
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    offeredCourse: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'OfferCourse'
    },
    faculty: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Faculty'
    },
    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    isEnrolled: {
        type: Boolean,
        default: false
    },
    courseMarks: {
        type: courseMarksSchema,
        default: {}
    },
    grade: {
        type: String,
        enum: Grades,
        default: 'N/A'
    },
    gradePoints: {
        type: Number,
        min: 0,
        max: 4,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const EnrolledCourseModel = mongoose.model<TEnrolledCourse>('EnrolledCourse', enrolledCourseSchema);