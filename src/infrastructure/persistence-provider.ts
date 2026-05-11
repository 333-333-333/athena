import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type {
  ApprovalRepository,
  ArtifactRepository,
  FeatureRepository,
  ProductionBriefRepository,
  ProjectRepository,
  ReadinessReportRepository,
  TraceLinkRepository,
} from "../application";
import type {
  Approval,
  KnowledgeArtifact,
  ProductionBrief,
  Project,
  ReadinessReport,
} from "../domain";
import type {
  AthenaConfig,
  AthenaPersistenceKind,
} from "./config/athena-config";
import { DEFAULT_SQLITE_PATH } from "./config/athena-config";
import { InMemoryApprovalRepository } from "./repositories/in-memory-approval-repository";
import { InMemoryArtifactRepository } from "./repositories/in-memory-artifact-repository";
import { InMemoryFeatureRepository } from "./repositories/in-memory-feature-repository";
import { InMemoryProductionBriefRepository } from "./repositories/in-memory-production-brief-repository";
import { InMemoryProjectRepository } from "./repositories/in-memory-project-repository";
import { InMemoryReadinessReportRepository } from "./repositories/in-memory-readiness-report-repository";
import { InMemoryTraceLinkRepository } from "./repositories/in-memory-trace-link-repository";
import { SQLiteFeatureRepository } from "./repositories/sqlite-feature-repository";
import { SQLiteTraceLinkRepository } from "./repositories/sqlite-trace-link-repository";

export interface PersistenceContext {
  readonly projectRepository: ProjectRepository;
  readonly artifactRepository: ArtifactRepository;
  readonly approvalRepository: ApprovalRepository;
  readonly readinessReportRepository: ReadinessReportRepository;
  readonly productionBriefRepository: ProductionBriefRepository;
  readonly traceLinkRepository: TraceLinkRepository;
  readonly featureRepository: FeatureRepository;
  readonly dispose?: () => Promise<void>;
}

export interface PersistenceProvider {
  readonly kind: AthenaPersistenceKind;
  createPersistence(config: AthenaConfig): Promise<PersistenceContext>;
}

export class InMemoryPersistenceProvider implements PersistenceProvider {
  readonly kind = "memory" as const;

  async createPersistence(_config: AthenaConfig): Promise<PersistenceContext> {
    return {
      projectRepository: new InMemoryProjectRepository(),
      artifactRepository: new InMemoryArtifactRepository(),
      approvalRepository: new InMemoryApprovalRepository(),
      readinessReportRepository: new InMemoryReadinessReportRepository(),
      productionBriefRepository: new InMemoryProductionBriefRepository(),
      traceLinkRepository: new InMemoryTraceLinkRepository(),
      featureRepository: new InMemoryFeatureRepository(),
    };
  }
}

export class SqlitePersistenceProvider implements PersistenceProvider {
  readonly kind = "sqlite" as const;

  async createPersistence(config: AthenaConfig): Promise<PersistenceContext> {
    const sqlitePath =
      config.persistence.kind === "sqlite"
        ? (config.persistence.sqlitePath ?? DEFAULT_SQLITE_PATH)
        : DEFAULT_SQLITE_PATH;

    await mkdir(dirname(sqlitePath), { recursive: true });
    const db = new Database(sqlitePath, { create: true, strict: true });
    runSqliteMigrations(db);

    return {
      projectRepository: new SQLiteProjectRepository(db),
      artifactRepository: new SQLiteArtifactRepository(db),
      approvalRepository: new SQLiteApprovalRepository(db),
      readinessReportRepository: new SQLiteReadinessReportRepository(db),
      productionBriefRepository: new SQLiteProductionBriefRepository(db),
      traceLinkRepository: new SQLiteTraceLinkRepository(db),
      featureRepository: new SQLiteFeatureRepository(db),
      dispose: async () => {
        db.close();
      },
    };
  }
}

export const selectPersistenceProvider = (
  kind: AthenaPersistenceKind,
): PersistenceProvider => {
  switch (kind) {
    case "memory":
      return new InMemoryPersistenceProvider();
    case "sqlite":
      return new SqlitePersistenceProvider();
  }
};

const migrations = [
  {
    id: "001_init",
    sql: `
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS readiness_reports (
        project_id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS production_briefs (
        project_id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
    `,
  },
  {
    id: "002_trace_links",
    sql: `
      CREATE TABLE IF NOT EXISTS trace_links (
        from_id TEXT NOT NULL,
        to_id TEXT NOT NULL,
        type TEXT NOT NULL,
        PRIMARY KEY (from_id, to_id, type)
      );
    `,
  },
  {
    id: "003_features",
    sql: `
      CREATE TABLE IF NOT EXISTS features (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
    `,
  },
] as const;

export const runSqliteMigrations = (db: Database): void => {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const selectMigration = db.query(
    "SELECT id FROM schema_migrations WHERE id = ?1 LIMIT 1",
  );
  const insertMigration = db.query(
    "INSERT INTO schema_migrations (id, applied_at) VALUES (?1, ?2)",
  );

  for (const migration of migrations) {
    const found = selectMigration.get(migration.id) as { id: string } | null;
    if (found !== null) {
      continue;
    }

    db.exec("BEGIN");
    try {
      db.exec(migration.sql);
      insertMigration.run(migration.id, new Date().toISOString());
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
};

class SQLiteProjectRepository implements ProjectRepository {
  private readonly saveQuery;
  private readonly getQuery;
  private readonly listQuery;

  constructor(db: Database) {
    this.saveQuery = db.query(
      "INSERT INTO projects (id, payload) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload",
    );
    this.getQuery = db.query(
      "SELECT payload FROM projects WHERE id = ?1 LIMIT 1",
    );
    this.listQuery = db.query("SELECT payload FROM projects ORDER BY id");
  }

  async save(project: Project): Promise<void> {
    this.saveQuery.run(project.id, JSON.stringify(project));
  }

  async getById(projectId: string): Promise<Project | null> {
    const row = this.getQuery.get(projectId) as { payload: string } | null;
    return row === null ? null : (JSON.parse(row.payload) as Project);
  }

  async list(): Promise<Project[]> {
    const rows = this.listQuery.all() as Array<{ payload: string }>;
    return rows.map((row) => JSON.parse(row.payload) as Project);
  }
}

class SQLiteArtifactRepository implements ArtifactRepository {
  private readonly createQuery;
  private readonly saveQuery;
  private readonly getQuery;
  private readonly listQuery;
  private readonly deleteQuery;

  constructor(db: Database) {
    this.createQuery = db.query(
      "INSERT INTO artifacts (id, payload) VALUES (?1, ?2)",
    );
    this.saveQuery = db.query(
      "INSERT INTO artifacts (id, payload) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload",
    );
    this.getQuery = db.query(
      "SELECT payload FROM artifacts WHERE id = ?1 LIMIT 1",
    );
    this.listQuery = db.query("SELECT payload FROM artifacts ORDER BY id");
    this.deleteQuery = db.query("DELETE FROM artifacts WHERE id = ?1");
  }

  async create(artifact: KnowledgeArtifact): Promise<void> {
    this.createQuery.run(artifact.id, JSON.stringify(artifact));
  }

  async save(artifact: KnowledgeArtifact): Promise<void> {
    this.saveQuery.run(artifact.id, JSON.stringify(artifact));
  }

  async getById(artifactId: string): Promise<KnowledgeArtifact | null> {
    const row = this.getQuery.get(artifactId) as { payload: string } | null;
    return row === null ? null : (JSON.parse(row.payload) as KnowledgeArtifact);
  }

  async list(): Promise<KnowledgeArtifact[]> {
    const rows = this.listQuery.all() as Array<{ payload: string }>;
    return rows.map((row) => JSON.parse(row.payload) as KnowledgeArtifact);
  }

  async update(artifactId: string, artifact: KnowledgeArtifact): Promise<void> {
    this.saveQuery.run(artifactId, JSON.stringify(artifact));
  }

  async delete(artifactId: string): Promise<void> {
    this.deleteQuery.run(artifactId);
  }
}

class SQLiteApprovalRepository implements ApprovalRepository {
  private readonly saveQuery;
  private readonly getQuery;

  constructor(db: Database) {
    this.saveQuery = db.query(
      "INSERT INTO approvals (id, payload) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload",
    );
    this.getQuery = db.query(
      "SELECT payload FROM approvals WHERE id = ?1 LIMIT 1",
    );
  }

  async save(approval: Approval): Promise<void> {
    this.saveQuery.run(approval.id, JSON.stringify(approval));
  }

  async getById(approvalId: string): Promise<Approval | null> {
    const row = this.getQuery.get(approvalId) as { payload: string } | null;
    return row === null ? null : (JSON.parse(row.payload) as Approval);
  }
}

class SQLiteReadinessReportRepository implements ReadinessReportRepository {
  private readonly saveQuery;
  private readonly getQuery;

  constructor(db: Database) {
    this.saveQuery = db.query(
      "INSERT INTO readiness_reports (project_id, payload) VALUES (?1, ?2) ON CONFLICT(project_id) DO UPDATE SET payload = excluded.payload",
    );
    this.getQuery = db.query(
      "SELECT payload FROM readiness_reports WHERE project_id = ?1 LIMIT 1",
    );
  }

  async save(report: ReadinessReport): Promise<void> {
    this.saveQuery.run(report.projectId, JSON.stringify(report));
  }

  async getByProjectId(projectId: string): Promise<ReadinessReport | null> {
    const row = this.getQuery.get(projectId) as { payload: string } | null;
    return row === null ? null : (JSON.parse(row.payload) as ReadinessReport);
  }
}

class SQLiteProductionBriefRepository implements ProductionBriefRepository {
  private readonly saveQuery;
  private readonly getQuery;

  constructor(db: Database) {
    this.saveQuery = db.query(
      "INSERT INTO production_briefs (project_id, payload) VALUES (?1, ?2) ON CONFLICT(project_id) DO UPDATE SET payload = excluded.payload",
    );
    this.getQuery = db.query(
      "SELECT payload FROM production_briefs WHERE project_id = ?1 LIMIT 1",
    );
  }

  async save(brief: ProductionBrief): Promise<void> {
    this.saveQuery.run(brief.projectId, JSON.stringify(brief));
  }

  async getByProjectId(projectId: string): Promise<ProductionBrief | null> {
    const row = this.getQuery.get(projectId) as { payload: string } | null;
    return row === null ? null : (JSON.parse(row.payload) as ProductionBrief);
  }
}
