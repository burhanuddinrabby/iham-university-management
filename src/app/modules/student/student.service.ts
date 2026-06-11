import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TStudent } from './student.interface';
import { StudentModel } from './student.model';
import { UserModel } from '../user/user.model';
import status from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';

const createStudentIntoDB = async (student: TStudent) => {
  if (await StudentModel.isUserExists(student.id)) {
    throw new AppError(500, "User already exists!");
  }
  
  const result = await StudentModel.create(student);
  return result;
};

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const searchFields = ['email', 'name.firstName', 'name.middleName', 'name.lastName', 'presentAddress']

  const studentQuery = new QueryBuilder(StudentModel.find().populate('admissionSemester')
    .populate('user')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    }), query)
    .search(searchFields).filter().sort().paginate().fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;
  return { meta, result };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Not student found by this id");
  }
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  if (! await StudentModel.isUserExists(id)) {
    throw new AppError(status.NOT_FOUND, "User doesn't exist!");
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deleteFromStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteFromStudent) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete the Student!");
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

    return deleteFromStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, "Something went wrong! Failed in the deletion process!!");
  }

};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  if (! await StudentModel.isUserExists(id)) {
    throw new AppError(status.NOT_FOUND, "User doesn't exist!");
  }

  const { name, guardian, localGuardian, ...remaining } = payload;

  const modifiedData: Record<string, unknown> = { ...remaining };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedData[`localGuardian.${key}`] = value
    }
  }

  const result = await StudentModel.findOneAndUpdate(
    { id },
    modifiedData,
    {
      new: true,
      runValidators: true
    }
  );

  return result;
};


export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB
};
