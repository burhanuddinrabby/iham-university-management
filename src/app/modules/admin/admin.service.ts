import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { AdminModel } from "./admin.model";
import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { TAdmin } from "./admin.interface";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const searchFields = ['email', 'name.firstName', 'name.middleName', 'name.lastName', 'presentAddress']

    const adminQuery = new QueryBuilder(AdminModel.find(), query)
        .search(searchFields).filter().sort().paginate().fields();

    const result = await adminQuery.modelQuery;
    const meta = await adminQuery.countTotal();
    return { meta, result };
};

const getSingleAdminFromDB = async (id: string) => {
    const result = await AdminModel.findOne({ id });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "No Admin found by this id");
    }
    return result;
};

const deleteAdminFromDB = async (id: string) => {
    if (! await AdminModel.isUserExists(id)) {
        throw new AppError(status.NOT_FOUND, "Admin doesn't exist!");
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deleteFromAdmin = await AdminModel.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deleteFromAdmin) {
            throw new AppError(status.BAD_REQUEST, "Failed to delete the Admin!");
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

        return deleteFromAdmin;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, "Something went wrong! Failed in the deletion process!!");
    }

};


const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
    if (! await AdminModel.isUserExists(id)) {
        throw new AppError(status.NOT_FOUND, "Admin doesn't exist!");
    }

    const { name, ...remaining } = payload;

    const modifiedData: Record<string, unknown> = { ...remaining };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedData[`name.${key}`] = value
        }
    }

    const result = await AdminModel.findOneAndUpdate(
        { id },
        modifiedData,
        {
            new: true,
            runValidators: true
        }
    );

    return result;
};

export const AdminServices = {
    getAllAdminsFromDB,
    getSingleAdminFromDB,
    deleteAdminFromDB,
    updateAdminIntoDB
};