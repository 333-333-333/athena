import type { AthenaConfig } from "../src/infrastructure/config/athena-config";
export const buildCompositionConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "test",
  persistence: {
    kind: overrides.persistence?.kind ?? "memory",
  },
});
