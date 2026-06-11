import status from "http-status";
import AppError from "../../errors/AppError";
import { TPrerequisitesPayload } from "./course.interface";
import { CourseModel } from "./course.model";

export const prerequisiteFormation = async (targets: Partial<TPrerequisitesPayload>[]) => {
    return await Promise.all(
        targets.map(async (item) => {
            if (item.courseId) {
                const existById = await CourseModel.findById(item?.courseId);
                if (!existById) {
                    throw new AppError(status.NOT_FOUND, `Course not found with course id: ${item.courseId}`);
                }
                return {
                    course: item.courseId,
                    isDeleted: item?.isDeleted || false
                };
            }
            const course = await CourseModel.findOne({
                courseCode: item.courseCode,
            });
            if (!course) {
                throw new AppError(status.NOT_FOUND, `Course not found with courseCode: ${item.courseCode}`);
            }

            return {
                course: course._id.toString(),
                isDeleted: item?.isDeleted || false
            };
        })
    );
}