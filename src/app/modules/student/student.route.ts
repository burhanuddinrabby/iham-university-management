import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidation } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get('/:studentID', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), StudentController.getSingleStudent);

router.patch('/:studentID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(updateStudentValidation), StudentController.updateStudent);

router.delete('/:studentID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), StudentController.deleteStudent);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), StudentController.getAllStudents);


export const StudentRoutes = router;
