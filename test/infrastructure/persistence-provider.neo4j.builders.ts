import type { AthenaConfig } from "../../src/infrastructure/config/athena-config";

export const buildNeo4jPersistenceConfig = (
  overrides: Partial<AthenaConfig> = {},
): AthenaConfig => ({
  env: overrides.env ?? "production",
  persistence: {
    kind: overrides.persistence?.kind ?? "neo4j",
  },
});
