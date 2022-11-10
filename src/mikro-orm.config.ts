import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { Options } from '@mikro-orm/core';
import path from 'path';

const config: Options = {
  entities: [Post],
  dbName: 'lireddit',
  type: 'postgresql',
  password: 'root',
  debug: !__prod__,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pathTs: undefined,
    glob: '!(*.d).{js,ts}',
  },
};

export default config;
