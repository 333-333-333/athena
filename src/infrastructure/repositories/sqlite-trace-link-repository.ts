import type { Database } from "bun:sqlite";
import type { TraceLinkRepository } from "../../application";
import type { TraceLink } from "../../domain";

export class SQLiteTraceLinkRepository implements TraceLinkRepository {
  constructor(private readonly db: Database) {}

  async save(link: TraceLink): Promise<void> {
    this.db
      .prepare(
        "INSERT INTO trace_links (from_id, to_id, type) VALUES (?1, ?2, ?3) ON CONFLICT(from_id, to_id, type) DO NOTHING",
      )
      .run(link.fromId, link.toId, link.type);
  }

  async listByArtifactId(artifactId: string): Promise<TraceLink[]> {
    const rows = this.db
      .prepare(
        "SELECT from_id, to_id, type FROM trace_links WHERE from_id = ?1 OR to_id = ?1 ORDER BY rowid ASC",
      )
      .all(artifactId) as Array<{
      from_id: string;
      to_id: string;
      type: TraceLink["type"];
    }>;

    return rows.map((row) => ({
      fromId: row.from_id,
      toId: row.to_id,
      type: row.type,
    }));
  }

  async list(): Promise<TraceLink[]> {
    const rows = this.db
      .prepare(
        "SELECT from_id, to_id, type FROM trace_links ORDER BY from_id, to_id, type",
      )
      .all() as Array<{
      from_id: string;
      to_id: string;
      type: TraceLink["type"];
    }>;
    return rows.map((row) => ({
      fromId: row.from_id,
      toId: row.to_id,
      type: row.type,
    }));
  }

  async delete(link: TraceLink): Promise<void> {
    this.db
      .prepare(
        "DELETE FROM trace_links WHERE from_id = ?1 AND to_id = ?2 AND type = ?3",
      )
      .run(link.fromId, link.toId, link.type);
  }
}
