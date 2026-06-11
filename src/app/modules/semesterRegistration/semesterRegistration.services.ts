import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { AcademicSemesterModel } from "../academicSemester/semester.model";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";

const createSemesterRegistrationIntoDB = async (payload: Partial<TSemesterRegistration>) => {
    const isSemesterExist = await AcademicSemesterModel.findById(payload?.academicSemester);
    if (!isSemesterExist) {
        throw new AppError(status.NOT_FOUND, 'This academic semester is not found');
    }

    const isUpcomingExist = await SemesterRegistrationModel.findOne({ status: 'upcoming' });
    if (isUpcomingExist) {
        throw new AppError(status.BAD_REQUEST, 'There is already a upcoming semester');
    }

    const isSemesterRegistered = await SemesterRegistrationModel.findOne({ academicSemester: payload?.academicSemester });
    if (isSemesterRegistered) {
        throw new AppError(status.CONFLICT, 'This semester is already registered');
    }

    const result = await SemesterRegistrationModel.create(payload);

    return result;

};

const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistrationModel.find()
        .populate('academicSemester'), query)
        .filter().sort().paginate().fields();

    const result = await semesterRegistrationQuery.modelQuery;
    const meta = await semesterRegistrationQuery.countTotal();
    return { meta, result };
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistrationModel.findById(id).populate('academicSemester');

    return result;
};


const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    //if the semester id ended then no update 
    const reqSemester = await SemesterRegistrationModel.findById(id);
    if (!reqSemester) {
        throw new AppError(status.NOT_FOUND, 'Semester not found !!');
    }
    if (reqSemester.status === 'ended') {
        throw new AppError(status.BAD_REQUEST, 'Semester is ended, no update operation can be done!');
    }

    //upcoming --> ongoing --> ended
    if (reqSemester.status === 'upcoming' && payload.status === 'ended') {
        throw new AppError(status.BAD_REQUEST, 'You can not end any upcoming semester!');
    }
    if (reqSemester.status === 'ongoing' && payload.status === 'upcoming') {
        throw new AppError(status.BAD_REQUEST, 'Ongoing semester can not be upcoming!');
    }

    const result = await SemesterRegistrationModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });

    return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
    const target = await SemesterRegistrationModel.findById(id);
    if (!target) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found!');
    }
    if (target?.status !== 'upcoming') {
        throw new AppError(status.BAD_REQUEST, `Can not delete any ${target?.status} semester!`)
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //delete all offered course with this registered semester
        const offeredCourseDeletion = await OfferedCourseModel.deleteMany(
            {
                semesterRegistration: id,
            },
            {
                session
            }
        );

        if (!offeredCourseDeletion) {
            throw new AppError(
                status.BAD_REQUEST,
                'Failed to delete all offered courses of this semester!',
            );
        }

        const semesterDeletion = await SemesterRegistrationModel.findByIdAndDelete(id, {
            session,
            new: true,
        });
        if (!semesterDeletion) {
            throw new AppError(
                status.BAD_REQUEST,
                'Failed to delete semester registration !',
            );
        }

        await session.commitTransaction();
        await session.endSession();
    } catch (e: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(e);
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};