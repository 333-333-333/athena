import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SQLiteFeatureRepository } from "../../../src/infrastructure/repositories/sqlite-feature-repository";
import { sqliteFeatureRepositoryFixtures } from "./sqlite-feature-repository.fixtures";

const tempDirs: string[] = [];
const createTempDbPath = async () => {
  const dir = await mkdtemp(join(tmpdir(), "athena-feature-sqlite-"));
  tempDirs.push(dir);
  return join(dir, "athena.sqlite");
};
afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("infrastructure/repositories/sqlite-feature-repository", () => {
  it("CRUD sqlite", async () => {
    // CON-031-01 | RF-031 AC-1
    const repository = new SQLiteFeatureRepository(await createTempDbPath());
    await repository.create(sqliteFeatureRepositoryFixtures.feature);
    expect(
      await repository.getById(sqliteFeatureRepositoryFixtures.feature.id),
    ).toEqual(sqliteFeatureRepositoryFixtures.feature);
  });
});
