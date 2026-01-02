import { USER_ROLE } from '../users/user.enum';

export type UserContext = {
  clerkUserId: string;

  email: string;
  name: string;

  role: USER_ROLE;
};

export type TAuthPayload = {
  sub?: string;
  userId?: string;
  email?: string;
  email_address?: string;
  primaryEmailAddress?: string;
  name?: string;
  fullName?: string;
  username?: string;
  [key: string]: unknown;
};

export interface IAuthVerifiedToken {
  payload?: TAuthPayload;
  [key: string]: unknown;
}
