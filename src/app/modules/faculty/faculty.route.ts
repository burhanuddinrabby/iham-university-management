import express from 'express';
import { FacultyController } from './faculty.controller';
import { updateFacultyValidation } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();
// - /api/v1/faculties
router.get('/:facultyID', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), FacultyController.getSingleFaculty);

router.patch('/:facultyID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(updateFacultyValidation), FacultyController.updateFaculty);

router.delete('/:facultyID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), FacultyController.deleteFaculty);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), FacultyController.getAllFaculties);


export const FacultyRoutes = router;
