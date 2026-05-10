import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";
export const persistenceProviderFixtures = {
  memoryConfig: {
    env: "test",
    persistence: { kind: "memory" },
  } satisfies AthenaConfig,
  neo4jConfig: {
    env: "production",
    persistence: { kind: "neo4j" },
  } satisfies AthenaConfig,
} as const;
