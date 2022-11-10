import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  title!: string;

  // @Property({onCreate:()=>new Date()})
  // createdAt = new Date();
  // @Property({ onUpdate: () => new Date() })
  // updatedAt = new Date();
}
