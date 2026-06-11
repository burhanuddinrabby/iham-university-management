import QueryBuilder from "../../builder/QueryBuilder";
import { codeMapper } from "./semester.constants";
import { TAcademicSemester } from "./semester.interface";
import { AcademicSemesterModel } from "./semester.model";

const createSemesterIntoDB = async (payload: TAcademicSemester) => {
    const result = await AcademicSemesterModel.create(payload);
    return result;
};


const getAllSemestersFromDB = async (query: Record<string, unknown>) => {
    const semesterQuery = new QueryBuilder(AcademicSemesterModel.find(), query).search(['name year']).filter().paginate().sort().fields();
    const result = await semesterQuery.modelQuery;
    const meta = await semesterQuery.countTotal();
    return { meta, result };
}

const getSingleSemestersFromDB = async (id: string) => {
    const result = await AcademicSemesterModel.findOne({
        _id: id
    });
    return result;
}

const updateSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {

    const result = await AcademicSemesterModel.findOneAndUpdate({ _id: id }, payload, {
        new: true
    });

    return result;
}


export const AcademicSemesterServices = {
    createSemesterIntoDB,
    getAllSemestersFromDB,
    getSingleSemestersFromDB,
    updateSemesterIntoDB
}