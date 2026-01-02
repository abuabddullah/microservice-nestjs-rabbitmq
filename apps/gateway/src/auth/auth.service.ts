import { createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthVerifiedToken, TAuthPayload, UserContext } from './auth.types';
import { USER_ROLE } from '../users/user.enum';

@Injectable()
export class AuthService {
  private readonly clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  private jwtVerifyOptions(): { secretKey: string | undefined } {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
    };
  }

  async verifyAndBuildContext(token: string): Promise<UserContext> {
    try {
      const verified = (await verifyToken(
        token,
        this.jwtVerifyOptions(),
      )) as IAuthVerifiedToken;

      // // decoded payload
      //   const payload = verified?.payload ?? verified?.payload ?? verified;
      const payload = (verified.payload ?? verified) as TAuthPayload;

      // clerk user id -> payload.sub
      const clerkUserId = payload?.sub ?? payload?.userId;

      if (!clerkUserId) {
        throw new UnauthorizedException('Token is missing user id ');
      }

      const role: USER_ROLE = USER_ROLE.USER;

      const emailFromToken =
        payload?.email ??
        payload?.email_address ??
        payload?.primaryEmailAddress ??
        '';

      const nameFromToken =
        payload?.name ?? payload?.fullName ?? payload?.username ?? '';

      if (emailFromToken && nameFromToken) {
        return {
          clerkUserId,
          email: emailFromToken,
          name: nameFromToken,
          role,
        };
      }

      const user = await this.clerk.users.getUser(clerkUserId);

      const primaryEmail =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        '';

      const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        primaryEmail ||
        clerkUserId;

      return {
        clerkUserId,
        email: emailFromToken || primaryEmail,
        name: nameFromToken || fullName,
        role,
      };
    } catch (err: any) {
      console.log('🚀 ~ AuthService ~ verifyAndBuildContext ~ err:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
