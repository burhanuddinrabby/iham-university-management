import express from 'express';
import { AuthValidations } from './auth.validations';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post('/login', validateRequest(AuthValidations.loginValidation), AuthController.login);

router.post('/refresh-token', validateRequest(AuthValidations.refreshTokenValidation), AuthController.refreshToken);

router.post('/change-password', auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student), validateRequest(AuthValidations.changePassValidation), AuthController.changePassword);

router.post('/forget-password', validateRequest(AuthValidations.forgetPassValidation), AuthController.forgetPassword);

router.post('/reset-password', validateRequest(AuthValidations.resetPassValidation), AuthController.resetPassword)

export const AuthRoutes = router;