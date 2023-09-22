/* eslint-disable space-before-function-paren */
import AuthService from '@/services/auth.service';
import { catchAsync } from '@/utils/catchAsync';
import response from '@/utils/response';

class AuthController {
  signIn = catchAsync(async (req, res, next) => {
    const { email, password, refreshToken } = req.body;
    const result = await AuthService.signIn(
      { email, password, refreshToken },
      next
    );
    return response(result, res);
  });

  signUp = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;
    const result = await AuthService.signUp({ email, password, name }, next);
    return response(result, res);
  });

  logout = catchAsync(async (req, res, next) => {
    const keyStore = req.keyStore;
    const result = await AuthService.logout({ keyStore }, next);
    return response(result, res);
  });

  handlerRefreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    const result = await AuthService.handlerRefreshToken(refreshToken, next);
    return response(result, res);
  });
}

export default new AuthController();
