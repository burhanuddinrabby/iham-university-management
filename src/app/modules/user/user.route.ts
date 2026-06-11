import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';
import { AdminValidation } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { UserValidations } from './user.validation';
import { upload } from '../../utils/uploadImage';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();


router.post('/create-student', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty), upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
}, validateRequest(studentValidations.createStudentValidation), UserControllers.createStudent);

router.post('/create-faculty', auth(USER_ROLES.superAdmin, USER_ROLES.admin), upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
}, validateRequest(facultyValidation.createFacultyValidation), UserControllers.createFaculty);


router.post('/create-admin', auth(USER_ROLES.superAdmin, USER_ROLES.admin), upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
}, validateRequest(AdminValidation.createAdminValidation), UserControllers.createAdmin);

router.post('/change-status/:id', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(UserValidations.changeStatusValidation), UserControllers.changeStatus);

router.get('/me', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), UserControllers.getMe);


export const UserRoutes = router;
