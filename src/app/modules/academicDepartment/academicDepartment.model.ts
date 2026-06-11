import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import status from "http-status";
import AppError from "../../errors/AppError";

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true
    }
}, {
    timestamps: true
});


academicDepartmentSchema.pre('save', async function (next) {
    const isDepartmentExist = await AcademicDepartmentModel.findOne({
        name: this.name,
    });
    if (isDepartmentExist) {
        throw new AppError(status.NOT_FOUND, 'Academic Department already exists');
    }
    next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery(); //returns which query is used

    const isDepartmentExist = await AcademicDepartmentModel.findOne(query);

    if (!isDepartmentExist) throw new AppError(status.NOT_FOUND, "Department Doesn't exist");

    next();

});

export const AcademicDepartmentModel = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema);