import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";

export const persistenceProviderNeo4jFixtures = {
  config: {
    env: "production",
    persistence: { kind: "neo4j" },
  } satisfies AthenaConfig,
} as const;
