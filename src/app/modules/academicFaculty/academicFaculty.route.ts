import express from 'express';
import { AcademicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/create-academic-faculty', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(AcademicFacultyValidations.createAcademicFacultyValidation), AcademicFacultyController.createAcademicFaculty);

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), AcademicFacultyController.getSingleAcademicFaculty);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(AcademicFacultyValidations.createAcademicFacultyValidation), AcademicFacultyController.updateAcademicFaculty);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), AcademicFacultyController.getAllAcademicFaculty);

export const AcademicFacultyRoutes = router;