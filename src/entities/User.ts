import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  name!: string;

  @Field()
  @Property({ type: 'text', unique: true, index: true })
  email!: string;

  @Property({ type: 'text' })
  password!: string;
}
