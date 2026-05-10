import { Database } from "bun:sqlite";
import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runSqliteMigrations } from "../../../src/infrastructure/persistence-provider";
import { SQLiteTraceLinkRepository } from "../../../src/infrastructure/repositories/sqlite-trace-link-repository";
import { sqliteTraceLinkRepositoryFixtures } from "./sqlite-trace-link-repository.fixtures";

const tempDirs: string[] = [];

const createTempDbPath = async () => {
  const dir = await mkdtemp(join(tmpdir(), "athena-trace-link-"));
  tempDirs.push(dir);
  return join(dir, "athena.sqlite");
};

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("sqlite-trace-link-repository", () => {
  it("supports save/list/delete", async () => {
    const dbPath = await createTempDbPath();
    const db = new Database(dbPath, { create: true, strict: true });
    runSqliteMigrations(db);
    const repository = new SQLiteTraceLinkRepository(db);
    const { first, second, third } = sqliteTraceLinkRepositoryFixtures;

    await repository.save(first);
    await repository.save(second);
    await repository.save(third);

    expect(await repository.listByArtifactId("REQ-2")).toEqual([first, second]);
    expect(await repository.listByArtifactId("UC-2")).toEqual([first, third]);

    await repository.delete(first);

    expect(await repository.listByArtifactId("REQ-2")).toEqual([second]);
    expect(await repository.listByArtifactId("UC-2")).toEqual([third]);

    db.close();
  });
});
