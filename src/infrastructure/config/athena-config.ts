export type AthenaEnvironment = "test" | "development" | "production";
export type AthenaPersistenceKind = "memory" | "sqlite";

export const DEFAULT_SQLITE_PATH = ".athena/athena.sqlite";

export interface AthenaConfig {
  readonly env: AthenaEnvironment;
  readonly persistence: {
    readonly kind: AthenaPersistenceKind;
    readonly sqlitePath?: string;
  };
}

export const DEFAULT_ATHENA_CONFIG: AthenaConfig = {
  env: "test",
  persistence: {
    kind: "memory",
    sqlitePath: DEFAULT_SQLITE_PATH,
  },
};

export const createAthenaConfig = (config: AthenaConfig): AthenaConfig => ({
  env: config.env,
  persistence: {
    kind: config.persistence.kind,
    sqlitePath:
      config.persistence.kind === "sqlite"
        ? (config.persistence.sqlitePath ?? DEFAULT_SQLITE_PATH)
        : config.persistence.sqlitePath,
  },
});

export const loadAthenaConfig = (
  env: Record<string, string | undefined> = process.env,
): AthenaConfig => {
  const resolvedEnv = normalizeEnvironment(env.ATHENA_ENV);
  const resolvedPersistence = normalizePersistenceKind(env.ATHENA_PERSISTENCE);
  const resolvedSqlitePath = normalizeSqlitePath(env.ATHENA_SQLITE_PATH);

  return createAthenaConfig({
    env: resolvedEnv,
    persistence: {
      kind: resolvedPersistence,
      sqlitePath:
        resolvedPersistence === "sqlite" ? resolvedSqlitePath : undefined,
    },
  });
};

export const validateAthenaConfig = (config: AthenaConfig): AthenaConfig => {
  if (config.env === "production" && config.persistence.kind === "memory") {
    throw new Error("Athena production cannot use memory persistence");
  }

  if (
    config.persistence.kind === "sqlite" &&
    (config.persistence.sqlitePath === undefined ||
      config.persistence.sqlitePath.trim() === "")
  ) {
    throw new Error("Athena sqlite persistence requires sqlitePath");
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
  if (value === "sqlite") {
    return value;
  }

  return DEFAULT_ATHENA_CONFIG.persistence.kind;
};

const normalizeSqlitePath = (value: string | undefined): string => {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed.length === 0) {
    return DEFAULT_SQLITE_PATH;
  }

  return trimmed;
};
