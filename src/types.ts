import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Response, Request } from 'express';
export type MyContext = {
  emFork: EntityManager<IDatabaseDriver<Connection>>;
  res: Response;
  req: Request;
};
