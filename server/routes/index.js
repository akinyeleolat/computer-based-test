import express from 'express';
import UserController from '../controllers/users';
import AdminController from '../controllers/admin';
import middlewares from '../middlewares';

const router = express.Router();

router.post('/auth/signup', middlewares.validateSignup, UserController.signup);
router.post('/auth/admin/signup', middlewares.validateSignup, AdminController.adminSignup);
router.post('/auth/login', middlewares.validateLogin, UserController.login);
router.post('/auth/admin/login', middlewares.validateLogin, AdminController.adminLogin);


export default router;