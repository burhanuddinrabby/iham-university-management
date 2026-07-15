import QueryBuilder from "../../builder/QueryBuilder";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const lastDept = await AcademicDepartmentModel.findOne({}, { departmentId: 1 }).sort({ createdAt: -1 }).lean();
    const lastDeptId = lastDept?.departmentId;
    if(lastDeptId){
        payload.departmentId = lastDeptId + 1;
    }else{
        payload.departmentId = 11;
    }
    const result = await AcademicDepartmentModel.create(payload);
    return result;
}

const getAllAcademicDepartmentsFromDB = async (query: Record<string, unknown>) => {
    const searchFields = ['name']
    const academicDepartmentQuery = new QueryBuilder(AcademicDepartmentModel.find().populate('academicFaculty'), query).search(searchFields).filter().sort().paginate().fields();
    const result = await academicDepartmentQuery.modelQuery;
    const meta = await academicDepartmentQuery.countTotal();
    return { meta, result };
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartmentModel.findById(id).populate('academicFaculty');
    return result;
}

const updateAcademicDepartmentIntoDB = async (id: string, payload: Partial<TAcademicDepartment>) => {
    const result = await AcademicDepartmentModel.findOneAndUpdate(
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

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB
}