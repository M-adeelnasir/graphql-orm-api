import { Post } from '../entities/Post';
import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql';
import { MyContext } from '../types';

@Resolver()
export class PostResolver {
  //@ find all posts
  @Query(() => [Post])
  posts(@Ctx() { emFork }: MyContext): Promise<Post[]> {
    return emFork.find(Post, {});
  }

  //@ find a single post by id
  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<Post | null> {
    return emFork.findOne(Post, { id });
  }

  //@create post
  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { emFork }: MyContext
  ): Promise<Post> {
    const post = emFork.create(Post, { title });
    await emFork.persistAndFlush(post);
    return post;
  }

  //@update a post
  @Mutation(() => Post)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { emFork }: MyContext
  ) {
    const post = await emFork.findOne(Post, { id });

    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await emFork.persistAndFlush(post);
    }

    return post;
  }

  //@delete post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<boolean> {
    await emFork.nativeDelete(Post, { id });
    return true;
  }
}
