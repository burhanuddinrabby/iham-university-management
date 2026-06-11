import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { FacultyModel } from "./faculty.model";
import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { TFaculty } from "./faculty.interface";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
    const searchFields = ['email', 'name.firstName', 'name.middleName', 'name.lastName', 'presentAddress']

    const facultyQuery = new QueryBuilder(FacultyModel.find()
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty'
            }
        }), query)
        .search(searchFields).filter().sort().paginate().fields();

    const result = await facultyQuery.modelQuery;
    const meta = await facultyQuery.countTotal();
    return { meta, result };
};

const getSingleFacultyFromDB = async (id: string) => {
    const result = await FacultyModel.findOne({ id })
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty'
            }
        });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Not faculty found by this id");
    }
    return result;
};

const deleteFacultyFromDB = async (id: string) => {
    if (! await FacultyModel.isUserExists(id)) {
        throw new AppError(status.NOT_FOUND, "Faculty doesn't exist!");
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deleteFromFaculty = await FacultyModel.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deleteFromFaculty) {
            throw new AppError(status.BAD_REQUEST, "Failed to delete the Faculty!");
        }

        const result = await UserModel.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!result) {
            throw new AppError(status.BAD_REQUEST, "Failed to delete the User!!");
        }

        await session.commitTransaction();
        await session.endSession();

        return deleteFromFaculty;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, "Something went wrong! Failed in the deletion process!!");
    }

};


const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
    if (! await FacultyModel.isUserExists(id)) {
        throw new AppError(status.NOT_FOUND, "Faculty doesn't exist!");
    }

    const { name, ...remaining } = payload;

    const modifiedData: Record<string, unknown> = { ...remaining };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedData[`name.${key}`] = value
        }
    }

    const result = await FacultyModel.findOneAndUpdate(
        { id },
        modifiedData,
        {
            new: true,
            runValidators: true
        }
    );

    return result;
};

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    deleteFacultyFromDB,
    updateFacultyIntoDB
};