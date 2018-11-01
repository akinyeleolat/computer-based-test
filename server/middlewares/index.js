import validateSignup from './validateSignup';
import validateLogin from './validateLogin';
import validatePostCourse from './validatePostCourse';
import validateUpdateCourse from './validateUpdateCourse';
import validateApproveUser from './validateApproveUser';
import verifyAdminToken from './verifyAdminToken';
import verifyUserToken from './verifyUserToken';

const middlewares = {
  validateSignup,
  validateLogin,
  validatePostCourse,
  validateUpdateCourse,
  validateApproveUser,
  verifyAdminToken,
  verifyUserToken,
};

export default middlewares;
