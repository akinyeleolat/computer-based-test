import express from 'express';
import UserController from '../controllers/users';
import middlewares from '../middlewares';

const router = express.Router();

router.post('/auth/signup', middlewares.validateSignup, UserController.signup);


export default router;
