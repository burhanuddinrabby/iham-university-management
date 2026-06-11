import express from 'express';
import { AcademicSemesterController } from './semester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './semester.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post('/create-semester', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(academicSemesterValidations.createAcademicSemesterValidation), AcademicSemesterController.createAcademicSemester);

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), AcademicSemesterController.getSingleSemester);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(academicSemesterValidations.updateAcademicSemesterValidation), AcademicSemesterController.updateSemester);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), AcademicSemesterController.getAllSemesters);

export const AcademicSemesterRoutes = router;