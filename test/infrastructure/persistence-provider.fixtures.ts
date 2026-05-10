import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";
export const persistenceProviderFixtures = {
  memoryConfig: {
    env: "test",
    persistence: { kind: "memory" },
  } satisfies AthenaConfig,
  sqliteConfig: {
    env: "production",
    persistence: { kind: "sqlite" },
  } satisfies AthenaConfig,
} as const;
