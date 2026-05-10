import type { AthenaConfig } from "../../../src/infrastructure/config/athena-config";
export const athenaConfigFixtures = {
  testMemory: {
    env: "test",
    persistence: { kind: "memory" },
  } satisfies AthenaConfig,
  productionNeo4j: {
    env: "production",
    persistence: { kind: "neo4j" },
  } satisfies AthenaConfig,
} as const;
