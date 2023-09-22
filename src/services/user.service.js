/* eslint-disable space-before-function-paren */
import User from '@/models/user.model';

export const findByEmail = async (
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1
  }
) => {
  return await User.findOne({ email }).select(select);
};
