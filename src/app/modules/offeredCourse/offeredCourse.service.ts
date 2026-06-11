import status from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { FacultyModel } from "../faculty/faculty.model";
import { CourseModel } from "../course/course.model";
import { hasTimeConflicts } from './offeredCourse.utils';
import QueryBuilder from "../../builder/QueryBuilder";
import { StudentModel } from "../student/student.model";


const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, section, faculty, days, startTime, endTime } = payload;

    const registeredSemester = await SemesterRegistrationModel.findById(semesterRegistration);
    if (!registeredSemester) {
        throw new AppError(status.NOT_FOUND, 'Registered Semester Not Found')
    }
    payload.academicSemester = registeredSemester.academicSemester;

    const isFacultyExist = await AcademicFacultyModel.findById(academicFaculty)
    if (!isFacultyExist) {
        throw new AppError(status.NOT_FOUND, 'Academic Faculty Not Found')
    }

    const isDepartmentExist = await AcademicDepartmentModel.findById(academicDepartment)
    if (!isDepartmentExist) {
        throw new AppError(status.NOT_FOUND, 'Academic Department Not Found')
    } else {
        //check the department belong to that faculty
        if ((isDepartmentExist.academicFaculty).toString() !== (isFacultyExist._id).toString()) {
            throw new AppError(status.BAD_REQUEST, `'${isDepartmentExist.name}' department doesn't not belong to '${isFacultyExist.name}' faculty!`);
        }
    }
    if (!await FacultyModel.findById(faculty)) {
        throw new AppError(status.NOT_FOUND, 'Faculty Not Found')
    }
    if (!await CourseModel.findById(course)) {
        throw new AppError(status.NOT_FOUND, 'Course Not Found')
    }

    //check same section and course exist on existing semester
    const isInvalidSemester = await OfferedCourseModel.findOne({
        semesterRegistration,
        course,
        section
    });
    if (isInvalidSemester) {
        throw new AppError(status.BAD_REQUEST, 'Offered Course with same section is already exist')
    }

    //each faculty schedule individually
    const assignedTimes = await OfferedCourseModel.find({
        semesterRegistration, faculty, days: {
            $in: days,
        }
    }).select('days startTime endTime');
    const newSchedule = { days, startTime, endTime };
    const hasConflicts = hasTimeConflicts(assignedTimes, newSchedule);
    if (hasConflicts) {
        throw new AppError(status.CONFLICT, "This faculty is unavailable at this time!");
    }

    const result = await OfferedCourseModel.create(payload);

    return result;
};
const getAllOfferedCourseFrom = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find().populate('semesterRegistration academicSemester academicFaculty academicDepartment course faculty'), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await offeredCourseQuery.modelQuery;
    const meta = await offeredCourseQuery.countTotal();
    return { meta, result };
};
const getSingleOfferedCourseFrom = async (id: string) => {
    const offeredCourse = await OfferedCourseModel.findById(id).populate('semesterRegistration academicSemester academicFaculty academicDepartment course faculty');

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
};

const updateOfferedCourseIntoDB = async (id: string, payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>) => {
    const targetedOfferedCourse = await OfferedCourseModel.findById(id);
    if (!targetedOfferedCourse) {
        throw new AppError(status.NOT_FOUND, "Offered Course doesn't exits'!")
    }

    const semesterRegistration = await SemesterRegistrationModel.findById(targetedOfferedCourse.semesterRegistration);
    if (semesterRegistration?.status !== 'upcoming') {
        throw new AppError(status.BAD_REQUEST, `Can not update offered course of ${semesterRegistration?.status} semester`)
    }

    if (!await FacultyModel.findById(payload.faculty)) {
        throw new AppError(status.NOT_FOUND, 'Faculty Not Found')
    }

    const assignedTimes = await OfferedCourseModel.find({
        semesterRegistration: semesterRegistration._id,
        faculty: payload.faculty,
        days: {
            $in: payload.days,
        }
    }).select('days startTime endTime');

    const newSchedule = {
        days: payload?.days,
        startTime: payload?.startTime,
        endTime: payload?.endTime
    };
    const hasConflicts = hasTimeConflicts(assignedTimes, newSchedule);
    if (hasConflicts) {
        throw new AppError(status.CONFLICT, "This faculty is unavailable at this time!");
    }

    const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
        new: true
    });

    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    const isOfferedCourseExists = await OfferedCourseModel.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    const semesterRegistrationStatus =
        await SemesterRegistrationModel.findById(isOfferedCourseExists.semesterRegistration).select('status');

    if (semesterRegistrationStatus?.status !== 'upcoming') {
        throw new AppError(
            status.BAD_REQUEST,
            `Offered course can not deleted! Because the semester is/has ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourseModel.findByIdAndDelete(id);

    return result;
};

const getMyOfferedCoursesFromDB = async (studentId: string, query: Record<string, unknown>) => {
    const student = await StudentModel.findOne({ id: studentId });
    //pagination setup
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const currentSemester = await SemesterRegistrationModel.findOne({ status: 'ongoing' });
    if (!currentSemester)
        throw new AppError(status.BAD_REQUEST, 'There is no ongoing semester!');

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentSemester?._id,
                academicDepartment: student?.academicDepartment,
                academicFaculty: student?.academicFaculty
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $unwind: '$course'
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingSemester: currentSemester._id,
                    studentId: student?._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$semesterRegistration', '$$currentOngoingSemester'],
                                    },
                                    {
                                        $eq: ['$student', '$$studentId'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ]
                            }
                        }
                    }
                ],
                as: 'enrolledCourses'
            }
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    studentId: student?._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$studentId'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ]
                            }
                        }
                    }
                ],
                as: 'completedCourses'
            }
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course'
                    }
                }
            }
        },
        {
            $addFields: {
                isAlreadyEnrolled: {
                    $in: ['$course._id', {
                        $map: {
                            input: '$enrolledCourses',
                            as: 'enrolled',
                            in: '$$enrolled.course'
                        }
                    }]
                },
                isPreRequisitesFulfilled: {
                    $or: [
                        {
                            $eq: ['$course.prerequisites', []]
                        },
                        {
                            $setIsSubset: ['$course.prerequisites.course', '$completedCourseIds']
                        },
                    ]
                }
            }
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulfilled: true
            }
        },
    ]

    const paginationQuery = [
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ]
    
    const result = await OfferedCourseModel.aggregate([
        ...aggregationQuery,
        ...paginationQuery
    ]);

    const totalEntries = (await OfferedCourseModel.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(totalEntries / limit);
    const meta = {
        page,
        limit,
        totalEntries,
        totalPage
    }

    return {
        meta,
        result
    };
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCourseFrom,
    getSingleOfferedCourseFrom,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
    getMyOfferedCoursesFromDB
}