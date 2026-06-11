import status from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface"
import { EnrolledCourseModel } from "./enrolledCourse.model";
import { StudentModel } from "../student/student.model";
import mongoose from "mongoose";
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from "../course/course.model";
import { FacultyModel } from "../faculty/faculty.model";
import { GradePoints } from "./enrolledCourse.constants";
import QueryBuilder from "../../builder/QueryBuilder";

const createEnrolledCourseIntoDB = async (id: string, payload: TEnrolledCourse) => {
    /**
     * check if offered course exist
     * check if the student is already enrolled
     * already registered maximum credit?
     * save
     */
    const { offeredCourse } = payload;
    const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);
    if (!isOfferedCourseExist) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found by this id!');
    } else if (isOfferedCourseExist?.maxCapacity <= 0) {
        throw new AppError(status.BAD_REQUEST, 'No empty slot for this section try another!');
    }

    //find out student data and check if he's already enrolled
    const studentData = await StudentModel.findOne({ id }, { _id: 1 });
    const isEnrolled = await EnrolledCourseModel.findOne({ student: studentData?._id, offeredCourse, semesterRegistration: isOfferedCourseExist?.semesterRegistration });

    if (isEnrolled)
        throw new AppError(status.CONFLICT, 'Your are already registered!');

    //credit validations
    const semesterRegistration = await SemesterRegistrationModel.findById(isOfferedCourseExist?.semesterRegistration, { maxCredit: 1 });//.select('maxCredit')

    if (!semesterRegistration)
        throw new AppError(status.NOT_FOUND, 'Invalid semester!!');

    const enrolledCourses = await EnrolledCourseModel.aggregate([
        {
            //finding courses of the student registered so far in this semester
            $match: {
                semesterRegistration: isOfferedCourseExist?.semesterRegistration,
                student: studentData?._id
            }
        },
        {
            //Course(courses) model || locally as 'course' in this(EnrolledCourseModel) model || _id from Course model (foreign) || return the value as enrolledSoFar
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledSoFar'
            }
        },
        {
            //deconstruct the enrolledSoFar array so we can count enrolledSoFar per individual course:
            $unwind: "$enrolledSoFar"
        },
        {
            $group: {
                _id: null,
                totalCredits: {
                    $sum: "$enrolledSoFar.credits"
                }
            }
        }
    ]);

    const totalCredits = enrolledCourses.length ? enrolledCourses[0]?.totalCredits : 0;
    //find out the course student wants to register and it's credits
    const course = await CourseModel.findById(isOfferedCourseExist.course, { credits: 1 });
    //eg: can register 9 credits in a semester
    //already registered 6 credits and new course that he wants to register is 3 credit so registration will be done
    if ((course?.credits + totalCredits) > semesterRegistration?.maxCredit) {
        throw new AppError(status.BAD_REQUEST, 'Already enrolled maximum credits!')
    }

    const payloadData = {
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        academicSemester: isOfferedCourseExist?.academicSemester,
        academicFaculty: isOfferedCourseExist?.academicFaculty,
        academicDepartment: isOfferedCourseExist?.academicDepartment,
        course: isOfferedCourseExist?.course,
        offeredCourse,
        student: studentData?._id,
        faculty: isOfferedCourseExist?.faculty,
        isEnrolled: true,
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const enrolled = await EnrolledCourseModel.create([payloadData], { session });
        if (!enrolled.length)
            throw new AppError(status.BAD_REQUEST, 'Failure occurred in enrollment process!');

        await OfferedCourseModel.findOneAndUpdate(isOfferedCourseExist._id, {
            maxCapacity: isOfferedCourseExist.maxCapacity - 1
        }, { session });

        await session.commitTransaction();
        await session.endSession();
        return enrolled;
    } catch (e) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, e as string);
    }
}

const updateEnrolledCourseIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {
    const { courseMarks, semesterRegistration, offeredCourse, student, ...remaining } = payload;

    const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty)
        throw new AppError(status.FORBIDDEN, 'Unable to proceed');
    const enrolledCourse = await EnrolledCourseModel.findOne({
        semesterRegistration,
        offeredCourse,
        student
    });

    if (!enrolledCourse)
        throw new AppError(status.NOT_FOUND, 'No enrolled student found!')
    if ((faculty._id).toString() !== (enrolledCourse.faculty).toString())
        throw new AppError(status.FORBIDDEN, 'You can not update this information!')

    const modifiedData: Record<string, unknown> = { ...remaining };
    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value
        }
    }
    const { CT1, CT2, CT3, assignment, attendance, presentation, midTerm, average, finalTerm } = enrolledCourse.courseMarks

    //calculate class test average
    let q1, q2, q3, avgMarks = 0;
    if (courseMarks?.CT1 || courseMarks?.CT2 || courseMarks?.CT3) {
        q1 = (courseMarks?.CT1 || CT1 || 0);
        q2 = (courseMarks?.CT2 || CT2 || 0);
        q3 = (courseMarks?.CT3 || CT3 || 0);
        avgMarks = Number(((q1 + q2 + q3) / 3.0).toFixed(2))
        modifiedData[`courseMarks.average`] = avgMarks;
    } else {
        q1 = CT1 || 0;
        q2 = CT2 || 0;
        q3 = CT3 || 0;
        avgMarks = average || 0
    }
    const assignmentMarks = courseMarks?.assignment || assignment || 0;
    const attendanceMarks = courseMarks?.attendance || attendance || 0;
    const presentationMarks = courseMarks?.presentation || presentation || 0;
    const midTermMarks = courseMarks?.midTerm || midTerm || 0;
    const finalMarks = courseMarks?.finalTerm || finalTerm || 0;

    //when all marks are available set grade, points, and completed
    if (q1 && q2 && q3 && assignmentMarks && attendanceMarks && presentationMarks && midTermMarks && finalMarks) {
        const totalMarks = avgMarks + assignmentMarks + attendanceMarks + presentationMarks + midTermMarks + finalMarks
        for (const value of GradePoints) {
            if (totalMarks >= value.min && totalMarks <= value.max) {
                modifiedData['grade'] = value.grade;
                modifiedData['gradePoints'] = value.point;
                modifiedData['isCompleted'] = true;
            }
        }
    }

    const result = await EnrolledCourseModel.findByIdAndUpdate(enrolledCourse._id, modifiedData, { new: true, runValidators: true })
    return result
}

const getMyEnrolledCourseFromDB = async (studentId: string, query: Record<string, unknown>) => {
    const student = await StudentModel.findOne({ id: studentId });

    if (!student)
        throw new AppError(status.NOT_FOUND, 'Student not found');

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourseModel.find({ student: student._id }).populate('semesterRegistration academicSemester academicFaculty academicDepartment course offeredCourse faculty student'),
        query
    );

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal();

    return { meta, result };
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseIntoDB,
    getMyEnrolledCourseFromDB
}