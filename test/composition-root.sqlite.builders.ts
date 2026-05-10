import type { AthenaConfig } from "../src/infrastructure/config/athena-config";

export const buildCompositionRootSqliteConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "production",
  persistence: {
    kind: overrides.persistence?.kind ?? "sqlite",
    sqlitePath: overrides.persistence?.sqlitePath ?? ".athena/athena.sqlite",
  },
});
