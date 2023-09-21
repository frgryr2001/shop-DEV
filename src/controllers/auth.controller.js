/* eslint-disable space-before-function-paren */
import AuthService from '@/services/auth.service';
import { catchAsync } from '@/utils/catchAsync';

class AuthController {
  static signUp = catchAsync(async (req, res, next) => {
    await AuthService.signUp(req.body, next);
  });
}

export default AuthController;
