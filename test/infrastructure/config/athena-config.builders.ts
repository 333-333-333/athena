import type { AthenaConfig } from "../../../src/infrastructure/config/athena-config";
export const buildAthenaConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "test",
  persistence: {
    kind: overrides.persistence?.kind ?? "memory",
    sqlitePath: overrides.persistence?.sqlitePath,
  },
});
