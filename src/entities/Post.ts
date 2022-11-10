import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  title!: string;

  // @Property({onCreate:()=>new Date()})
  // createdAt = new Date();
  // @Property({ onUpdate: () => new Date() })
  // updatedAt = new Date();
}
