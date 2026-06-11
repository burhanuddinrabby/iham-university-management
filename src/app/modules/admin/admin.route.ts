import express from 'express';
import { AdminController } from './admin.controller';
import { updateAdminValidation } from './admin.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get('/:adminID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), AdminController.getSingleAdmin);

router.patch('/:adminID', auth(USER_ROLES.superAdmin, USER_ROLES.admin), validateRequest(updateAdminValidation), AdminController.updateAdmin);

router.delete('/:adminID', auth(USER_ROLES.superAdmin), AdminController.deleteAdmin);

router.get('/', auth(USER_ROLES.superAdmin, USER_ROLES.admin), AdminController.getAllAdmins);


export const AdminRoutes = router;
