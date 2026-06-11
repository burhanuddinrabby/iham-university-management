import { StudentServices } from './student.service';
import sendResponse from '../../utils/sentResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All Students fetched successfully',
    meta: result.meta,
    data: result.result
  })
});

const getSingleStudent = catchAsync(async (req, res) => {
  const studentID = req.params.studentID;

  const result = await StudentServices.getSingleStudentFromDB(studentID);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student fetched successfully',
    data: result,
  })

});
const deleteStudent = catchAsync(async (req, res) => {
  const studentID = req.params.studentID;

  const result = await StudentServices.deleteStudentFromDB(studentID);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  })
});

const updateStudent = catchAsync(async (req, res) => {
  const id = req.params.studentID;

  const result = await StudentServices.updateStudentIntoDB(id, req.body.student);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student updated successfully!!",
    data: result
  });
})

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent
};
