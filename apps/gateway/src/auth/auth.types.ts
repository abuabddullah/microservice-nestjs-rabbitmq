import { USER_ROLE } from '../users/user.enum';

export type UserContext = {
  clerkUserId: string;

  email: string;
  name: string;

  role: USER_ROLE;
};
