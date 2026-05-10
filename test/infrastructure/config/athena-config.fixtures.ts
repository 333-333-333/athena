import type { AthenaConfig } from "../../../src/infrastructure/config/athena-config";
export const athenaConfigFixtures = {
  testMemory: {
    env: "test",
    persistence: { kind: "memory" },
  } satisfies AthenaConfig,
  productionSqlite: {
    env: "production",
    persistence: { kind: "sqlite", sqlitePath: ".athena/athena.sqlite" },
  } satisfies AthenaConfig,
} as const;
