import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TCourse, TCourseFaculty, TCoursePayload, TPrerequisites, TPrerequisitesPayload } from './course.interface';
import { CourseFacultyModel, CourseModel } from "./course.model"
import { prerequisiteFormation } from "./course.utils";

const createCourseIntoDB = async (payload: TCoursePayload) => {
    const courseCode = payload?.courseCode || (payload?.prefix + payload?.code)
    payload.courseCode = courseCode;
    if (payload?.prerequisites.length) {
        const oldData: TPrerequisitesPayload[] = [...payload.prerequisites]
        const prerequisitesArray: TPrerequisites[] = await Promise.all(
            oldData.map(async (item) => {
                if (item?.courseId) {
                    return {
                        course: item.courseId as string,
                    };
                }

                const course = await CourseModel.findOne({
                    courseCode: item.courseCode,
                });

                if (!course) {
                    throw new Error(`Course not found: ${item.courseCode}`);
                }

                return {
                    course: course._id.toString(),
                };
            })
        );
        const newData: TCourse = {
            title: payload.title,
            prefix: payload.prefix,
            code: payload.code,
            credits: payload.credits,
            courseCode: payload.courseCode,
            prerequisites: [...prerequisitesArray]
        }
        const result = await CourseModel.create(newData);
        return result;
    }
    const result = await CourseModel.create(payload);
    return result;

}

const updateCourseIntoDB = async (id: string, payload: Partial<TCoursePayload>) => {
    const { prerequisites, ...remainingData } = payload;
    remainingData.courseCode = remainingData?.courseCode || (remainingData?.prefix as string + remainingData?.code)

    if (prerequisites && prerequisites.length) {
        const oldPrerequisites = await CourseModel.findById(id).select('prerequisites.isDeleted prerequisites.course');
        const payloadFormattedData = await prerequisiteFormation(prerequisites);

        const map = new Map();
        // first insert old
        (oldPrerequisites?.prerequisites as TPrerequisites[]).forEach((item) => {
            map.set(item.course.toString(), item);
        });
        // then overwrite with updated payload
        payloadFormattedData.forEach((item) => {
            map.set(item.course.toString(), item);
        });

        const newPrerequisites = Array.from(map.values()).filter(
            (item) => item.isDeleted === false
        );
        await CourseModel.findByIdAndUpdate(
            id,
            {
                ...remainingData,
                prerequisites: [...newPrerequisites]
            },
            { new: true, runValidators: true }
        );

        const result = await CourseModel.findById(id).populate('prerequisites.course');
        return result;

    }
    //basic course info update
    await CourseModel.findByIdAndUpdate(
        id,
        remainingData,
        { new: true, runValidators: true }
    );
    const result = await CourseModel.findById(id).populate('prerequisites.course');
    return result;
}


const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const searchFields = ['title', 'prefix', 'code'];
    const courseQuery = new QueryBuilder(CourseModel.find().populate('prerequisites.course'), query)
        .search(searchFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await courseQuery.countTotal();
    const result = await courseQuery.modelQuery;
    if (!result.length) {
        throw new AppError(status.NOT_FOUND, 'No courses found');
    }
    return { meta, result };
}

const getSingleCourseFromDB = async (id: string) => {
    const result = await CourseModel.findById(id).populate('prerequisites.course');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'No course found by this Id');
    }
    return result;
}

const deleteCourseFromDB = async (id: string) => {
    const result = await CourseModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    return result;
}

const assignCourseFacultiesIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFacultyModel.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: {
                faculties: {
                    $each: payload
                }
            }
        },
        {
            upsert: true,
            new: true
        }
    );

    return result;
}

const removeCourseFacultiesFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFacultyModel.findByIdAndUpdate(
        id,
        {
            $pull: {
                faculties: {
                    $in: payload
                }
            }
        },
        {
            new: true
        }
    );

    return result;
}

const getFacultiesWithCourseFromDB = async (courseId: string) => {
    const result = await CourseFacultyModel.findOne({ course: courseId }).populate(
        'faculties',
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignCourseFacultiesIntoDB,
    removeCourseFacultiesFromDB,
    getFacultiesWithCourseFromDB
}