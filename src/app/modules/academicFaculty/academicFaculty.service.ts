import QueryBuilder from "../../builder/QueryBuilder";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = await AcademicFacultyModel.create(payload);
    return result;
}

const getAllAcademicFacultiesFromDB = async (query: Record<string, unknown>) => {
    const searchFields = ['name']
    const academicFacultyQuery = new QueryBuilder(AcademicFacultyModel.find(), query).search(searchFields).filter().paginate().fields();
    const result = await academicFacultyQuery.modelQuery;
    const meta = await academicFacultyQuery.countTotal();
    return { meta, result };
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFacultyModel.findById(id);
    return result;
}

const updateAcademicFacultyIntoDB = async (id: string, payload: Partial<TAcademicFaculty>) => {
    const result = await AcademicFacultyModel.findOneAndUpdate(
        {
            _id: id
        },
        payload,
        {
            new: true
        }
    );

    return result;
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB
}