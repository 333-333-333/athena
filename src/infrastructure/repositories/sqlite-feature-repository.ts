import { Database } from "bun:sqlite";
import type { FeatureRepository } from "../../application/ports/output";
import type { Feature } from "../../domain";
import { runSqliteMigrations } from "../persistence-provider";

export class SQLiteFeatureRepository implements FeatureRepository {
  private readonly db: Database;
  private readonly createQuery;
  private readonly getByIdQuery;
  private readonly listQuery;
  private readonly updateQuery;
  private readonly deleteQuery;

  constructor(dbOrPath: Database | string) {
    this.db =
      typeof dbOrPath === "string"
        ? new Database(dbOrPath, { create: true, strict: true })
        : dbOrPath;
    runSqliteMigrations(this.db);

    this.createQuery = this.db.query(
      "INSERT INTO features (id, payload) VALUES (?1, ?2)",
    );
    this.getByIdQuery = this.db.query(
      "SELECT payload FROM features WHERE id = ?1 LIMIT 1",
    );
    this.listQuery = this.db.query("SELECT payload FROM features ORDER BY id");
    this.updateQuery = this.db.query(
      "UPDATE features SET payload = ?2 WHERE id = ?1",
    );
    this.deleteQuery = this.db.query("DELETE FROM features WHERE id = ?1");
  }

  async create(feature: Feature): Promise<void> {
    this.createQuery.run(feature.id, JSON.stringify(feature));
  }

  async getById(id: string): Promise<Feature | null> {
    const row = this.getByIdQuery.get(id) as { payload: string } | null;
    return row ? (JSON.parse(row.payload) as Feature) : null;
  }

  async list(): Promise<Feature[]> {
    const rows = this.listQuery.all() as Array<{ payload: string }>;
    return rows.map((row) => JSON.parse(row.payload) as Feature);
  }

  async update(
    id: string,
    changes: Partial<Omit<Feature, "id" | "createdAt">>,
  ): Promise<void> {
    const current = await this.getById(id);
    if (current === null) {
      return;
    }

    this.updateQuery.run(id, JSON.stringify({ ...current, ...changes }));
  }

  async delete(id: string): Promise<void> {
    this.deleteQuery.run(id);
  }
}
