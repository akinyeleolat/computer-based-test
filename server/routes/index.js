import express from 'express';
import UserController from '../controllers/users';
import AdminController from '../controllers/admin';
import CourseController from '../controllers/course';
import middlewares from '../middlewares';
import validateUpdateCourse from '../middlewares/validateUpdateCourse';

const router = express.Router();

router.post('/auth/signup', middlewares.validateSignup, UserController.signup);
router.post('/auth/admin/signup', middlewares.validateSignup, AdminController.adminSignup);
router.post('/auth/login', middlewares.validateLogin, UserController.login);
router.post('/auth/admin/login', middlewares.validateLogin, AdminController.adminLogin);

router.get('/courses',middlewares.verifyUserToken, CourseController.getAllCourses);

router.use('*', middlewares.verifyAdminToken);
router.post('/courses', middlewares.validatePostCourse, CourseController.postCourse);
router.patch('/courses/:id', middlewares.validateUpdateCourse, CourseController.updateCourse);
export default router;
