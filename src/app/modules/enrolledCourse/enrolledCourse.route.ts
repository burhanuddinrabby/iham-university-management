import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidations } from './enrolledCourse.validations';
import { EnrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/create-enrolled-course', auth(USER_ROLES.student), validateRequest(enrolledCourseValidations.createEnrolledCourseValidation), EnrolledCourseController.createEnrolledCourse);

router.patch('/update-enrolled-course-marks', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), validateRequest(enrolledCourseValidations.updateEnrolledCourseMarksValidations), EnrolledCourseController.updateEnrolledCourse);

router.get('/my-enrolled-courses', auth(USER_ROLES.student), EnrolledCourseController.getMyEnrolledCourse);

export const EnrolledCourseRoutes = router;