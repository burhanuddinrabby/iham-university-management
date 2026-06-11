import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/create-semester-registration', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(semesterRegistrationValidations.createSemesterRegistration), SemesterRegistrationController.createSemesterRegistration);

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), SemesterRegistrationController.getSingleSemesterRegistration);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(semesterRegistrationValidations.updateSemesterRegistration), SemesterRegistrationController.updateSemesterRegistration);

router.delete('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), SemesterRegistrationController.deleteSemesterRegistration);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), SemesterRegistrationController.getAllSemesterRegistration);

export const semesterRegistrationRoutes = router;