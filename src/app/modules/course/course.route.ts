import express from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), CourseController.getSingleCourse);

router.delete('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), CourseController.deleteCourse);

router.post('/create-course', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(CourseValidations.createCourseValidation), CourseController.createCourse);

router.patch('/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(CourseValidations.updateCourseValidation), CourseController.updateCourse);

router.put('/:id/assign-faculties', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(CourseValidations.courseFacultyValidation), CourseController.assignFaculties);

router.delete('/:id/remove-faculties', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(CourseValidations.courseFacultyValidation), CourseController.removeFaculties);

router.get('/:id/get-faculties', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), validateRequest(CourseValidations.courseFacultyValidation), CourseController.getFacultiesWithCourse);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), CourseController.getAllCourses);

export const CourseRoutes = router;