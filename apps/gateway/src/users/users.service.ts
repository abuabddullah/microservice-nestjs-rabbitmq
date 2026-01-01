import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, TUserDocument } from './user.schema';
import { Model } from 'mongoose';
import { USER_ROLE } from './user.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
  ) {}

  async upsertAuthUser(input: {
    clerkUserId: string;
    email: string;
    name: string;
  }) {
    const now = new Date();

    return this.userModel.findOneAndUpdate(
      {
        clerkUserId: input.clerkUserId,
      },
      {
        $set: {
          email: input.email,
          name: input.name,
          lastSeenAt: now,
        },
        $setOnInsert: {
          role: USER_ROLE.USER,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async findByClerkUserId(clerkUserId: string) {
    return this.userModel.findOne({ clerkUserId });
  }
}
