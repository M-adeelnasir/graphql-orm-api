import 'reflect-metadata';
import { PostResolver } from './resolvers/post';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import config from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HealthCheck } from './resolvers/health-check';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(config);
  const emFork = orm.em.fork();
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HealthCheck, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ emFork }),
  });

  const app = express();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(1337, () => {
    console.log(`Server is listening on port 1337`);
  });
};

main();
