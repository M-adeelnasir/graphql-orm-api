import { Resolver, Query } from 'type-graphql';
@Resolver()
export class HealthCheck {
  @Query(() => String)
  health() {
    return 'OK';
  }
}
