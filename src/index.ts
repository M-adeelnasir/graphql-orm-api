import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import config from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(config);
  const emFork = orm.em.fork();
  await orm.getMigrator().up();

  //   const post = emFork.create(Post, { title: 'hello' });
  //   await emFork.persistAndFlush(post);

  const posts = await emFork.find(Post, {});
  console.log(posts);
};

main();
