export type AthenaEnvironment = "test" | "development" | "production";
export type AthenaPersistenceKind = "memory" | "neo4j";

export interface AthenaConfig {
  readonly env: AthenaEnvironment;
  readonly persistence: {
    readonly kind: AthenaPersistenceKind;
  };
}

export const DEFAULT_ATHENA_CONFIG: AthenaConfig = {
  env: "test",
  persistence: {
    kind: "memory",
  },
};

export const createAthenaConfig = (config: AthenaConfig): AthenaConfig => ({
  env: config.env,
  persistence: {
    kind: config.persistence.kind,
  },
});

export const loadAthenaConfig = (
  env: Record<string, string | undefined> = process.env,
): AthenaConfig => {
  const resolvedEnv = normalizeEnvironment(env.ATHENA_ENV);
  const resolvedPersistence = normalizePersistenceKind(env.ATHENA_PERSISTENCE);

  return createAthenaConfig({
    env: resolvedEnv,
    persistence: {
      kind: resolvedPersistence,
    },
  });
};

export const validateAthenaConfig = (config: AthenaConfig): AthenaConfig => {
  if (config.env === "production" && config.persistence.kind === "memory") {
    throw new Error("Athena production cannot use memory persistence");
  }

  return createAthenaConfig(config);
};

const normalizeEnvironment = (value: string | undefined): AthenaEnvironment => {
  if (value === "development" || value === "production" || value === "test") {
    return value;
  }

  return DEFAULT_ATHENA_CONFIG.env;
};

const normalizePersistenceKind = (
  value: string | undefined,
): AthenaPersistenceKind => {
  if (value === "neo4j") {
    return value;
  }

  return DEFAULT_ATHENA_CONFIG.persistence.kind;
};
