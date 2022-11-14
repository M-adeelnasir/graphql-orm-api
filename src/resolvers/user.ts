import {
  Resolver,
  Arg,
  Ctx,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import argon from 'argon2';
import { MyContext } from './../types';
import { User } from '../entities/User';

declare module 'express-session' {
  export interface SessionData {
    user: any;
  }
}

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
}
@InputType()
class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field?: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
//@register user
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() { emFork }: MyContext
  ): Promise<UserResponse> {
    try {
      const { email, name, password } = options;
      if (password.length <= 3) {
        return {
          errors: [
            {
              field: 'password',
              message: 'lenght must be geater then 3',
            },
          ],
        };
      }
      const hash = await argon.hash(password);
      const user = emFork.create(User, { email, name, password: hash });
      await emFork.persistAndFlush(user);
      return { user };
    } catch (err) {
      if (err.code | err.detail.includes('already exists.')) {
        return {
          errors: [
            {
              field: 'Email',
              message: 'Email is already registered',
            },
          ],
        };
      }
      return err;
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() { emFork, req, res }: MyContext
  ): Promise<UserResponse> {
    const { email, password } = options;
    const user = await emFork.findOne(User, { email });
    if (!user) {
      return {
        errors: [
          {
            message: 'Invalid Credentials',
          },
        ],
      };
    }

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) {
      return {
        errors: [
          {
            message: 'Invalid Credentials',
          },
        ],
      };
    }

    res.cookie('user', user.email);

    req.session.user = user.id;

    console.log(req.session);

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, emFork }: MyContext): Promise<User | null> {
    console.log(req.session);

    if (!req.session.user) {
      return null;
    }
    const user = await emFork.findOne(User, { id: req.session.user });

    return user;
  }
}
