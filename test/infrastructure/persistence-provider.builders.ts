import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";
export const buildPersistenceConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "test",
  persistence: {
    kind: overrides.persistence?.kind ?? "memory",
  },
});
