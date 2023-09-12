import { User } from '@src/types/models/User';

export type CreatedUser = {
  email: string;
  password: string;
  loginCookie: string;

  user: User;
};
