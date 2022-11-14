import 'reflect-metadata';
import { PostResolver } from './resolvers/post';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import config from './mikro-orm.config';
import cors from 'cors';
import express from 'express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HealthCheck } from './resolvers/health-check';
import { UserResolver } from './resolvers/user';

import session from 'express-session';
import connectRedis from 'connect-redis';
import * as redis from 'redis';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  legacyMode: true,
});

const main = async () => {
  const orm = await MikroORM.init(config);
  const emFork = orm.em.fork();
  await orm.getMigrator().up();
  const app = express();

  await redisClient.connect().then(() => console.log('connected to redis'));

  app.use(cors());
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 356 * 10, //10years
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      },
      saveUninitialized: false,
      secret: 'skdjjcsjhfj',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HealthCheck, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ emFork, req, res }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(1337, () => {
    console.log(`Server is listening on port 1337`);
  });
};

main();
