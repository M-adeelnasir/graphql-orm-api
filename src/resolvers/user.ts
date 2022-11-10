import { Resolver, Arg, Ctx, Mutation, InputType, Field } from 'type-graphql';
import argon from 'argon2';
import { MyContext } from './../types';
import { User } from '../entities/User';

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
}

@Resolver()
//@register user
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() { emFork }: MyContext
  ): Promise<User> {
    try {
      const { email, name, password } = options;
      const hash = await argon.hash(password);
      const user = emFork.create(User, { email, name, password: hash });
      await emFork.persistAndFlush(user);
      return user;
    } catch (err) {
      if (err.code | err.detail.includes('already exists.')) {
      }
      return err.message;
    }
  }
}
