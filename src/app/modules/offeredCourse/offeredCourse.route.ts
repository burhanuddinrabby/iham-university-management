import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validations';
import { OfferedCourseController } from './offeredCourse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/create-offered-course', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(offeredCourseValidations.createOfferedCourseValidation), OfferedCourseController.createOfferedCourse);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(offeredCourseValidations.updateOfferedCourseValidation), OfferedCourseController.updateOfferedCourse);

router.get('/my-offered-courses', auth(USER_ROLES.student), OfferedCourseController.getMyOfferedCourses);

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), OfferedCourseController.getSingleOfferedCourse);

router.delete('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), OfferedCourseController.deleteOfferedCourse);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), OfferedCourseController.getAllOfferedCourse);

export const OfferedCourseRoutes = router;