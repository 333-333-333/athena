import type { AthenaConfig } from "../src/infrastructure/config/athena-config";

export const buildCompositionRootNeo4jConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "production",
  persistence: {
    kind: overrides.persistence?.kind ?? "neo4j",
  },
});
