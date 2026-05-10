import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";

export const persistenceProviderSqliteFixtures = {
  config: {
    env: "production",
    persistence: { kind: "sqlite", sqlitePath: ".athena/athena.sqlite" },
  } satisfies AthenaConfig,
} as const;
