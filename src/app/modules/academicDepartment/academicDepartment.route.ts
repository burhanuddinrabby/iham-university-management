import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/create-department', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidation), AcademicDepartmentController.createAcademicDepartment);

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), AcademicDepartmentController.getSingleAcademicDepartment);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(AcademicDepartmentValidations.updateAcademicDepartmentValidation), AcademicDepartmentController.updateAcademicDepartment);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), AcademicDepartmentController.getAllAcademicDepartments);

export const AcademicDepartmentRoutes = router;