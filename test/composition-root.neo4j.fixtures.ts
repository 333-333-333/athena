import { persistenceProviderNeo4jFixtures } from "./infrastructure/persistence-provider.neo4j.fixtures";

export const compositionRootNeo4jFixtures = {
  config: persistenceProviderNeo4jFixtures.config,
} as const;
