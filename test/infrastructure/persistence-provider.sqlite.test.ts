import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  SqlitePersistenceProvider,
  selectPersistenceProvider,
} from "../../src/infrastructure/persistence-provider";
import { buildSqlitePersistenceConfig } from "./persistence-provider.sqlite.builders";
import { persistenceProviderSqliteFixtures } from "./persistence-provider.sqlite.fixtures";

const tempDirs: string[] = [];

const createTempDbPath = async () => {
  const dir = await mkdtemp(join(tmpdir(), "athena-sqlite-"));
  tempDirs.push(dir);
  return join(dir, "athena.sqlite");
};

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("persistence-provider sqlite", () => {
  it("selects sqlite provider", () => {
    expect(
      selectPersistenceProvider(
        persistenceProviderSqliteFixtures.config.persistence.kind,
      ),
    ).toBeInstanceOf(SqlitePersistenceProvider);
  });

  it("creates sqlite context with real repositories and idempotent migrations", async () => {
    const dbPath = await createTempDbPath();
    const provider = new SqlitePersistenceProvider();
    const config = buildSqlitePersistenceConfig({
      persistence: { kind: "sqlite", sqlitePath: dbPath },
    });

    const first = await provider.createPersistence(config);
    const second = await provider.createPersistence(config);

    expect(first.projectRepository.constructor.name).toBe(
      "SQLiteProjectRepository",
    );
    expect(first.artifactRepository.constructor.name).toBe(
      "SQLiteArtifactRepository",
    );
    expect(first.approvalRepository.constructor.name).toBe(
      "SQLiteApprovalRepository",
    );
    expect(first.readinessReportRepository.constructor.name).toBe(
      "SQLiteReadinessReportRepository",
    );
    expect(first.productionBriefRepository.constructor.name).toBe(
      "SQLiteProductionBriefRepository",
    );

    await first.projectRepository.save({
      id: "p1",
      name: "Project One",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(await second.projectRepository.getById("p1")).toEqual({
      id: "p1",
      name: "Project One",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    await first.dispose?.();
    await second.dispose?.();
  });

  it("supports save/get/overwrite/missing across sqlite repositories", async () => {
    const dbPath = await createTempDbPath();
    const provider = new SqlitePersistenceProvider();
    const context = await provider.createPersistence(
      buildSqlitePersistenceConfig({
        persistence: { kind: "sqlite", sqlitePath: dbPath },
      }),
    );

    expect(await context.projectRepository.getById("missing")).toBeNull();
    expect(await context.artifactRepository.getById("missing")).toBeNull();
    expect(await context.approvalRepository.getById("missing")).toBeNull();
    expect(
      await context.readinessReportRepository.getByProjectId("missing"),
    ).toBeNull();
    expect(
      await context.productionBriefRepository.getByProjectId("missing"),
    ).toBeNull();

    await context.projectRepository.save({
      id: "p2",
      name: "Project Two",
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    await context.projectRepository.save({
      id: "p2",
      name: "Project Two Updated",
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    expect(await context.projectRepository.getById("p2")).toEqual({
      id: "p2",
      name: "Project Two Updated",
      createdAt: "2026-01-02T00:00:00.000Z",
    });

    await context.artifactRepository.save({
      id: "a2" as unknown as import("../../src/domain").ArtifactId,
      title: "Artifact Two",
      status: "draft",
      version: { major: 1, minor: 0, patch: 0 },
    });
    await context.artifactRepository.save({
      id: "a2" as unknown as import("../../src/domain").ArtifactId,
      title: "Artifact Two Updated",
      status: "approved",
      version: { major: 2, minor: 0, patch: 0 },
    });
    expect(await context.artifactRepository.getById("a2")).toEqual({
      id: "a2" as unknown as import("../../src/domain").ArtifactId,
      title: "Artifact Two Updated",
      status: "approved",
      version: { major: 2, minor: 0, patch: 0 },
    });

    await context.approvalRepository.save({
      id: "ap2",
      artifactId: "a2",
      approvedBy: "owner",
      evidence: { id: "ev1", source: "test", uri: "urn:test:one" },
    });
    await context.approvalRepository.save({
      id: "ap2",
      artifactId: "a2",
      approvedBy: "owner2",
      evidence: { id: "ev2", source: "test", uri: "urn:test:two" },
    });
    expect(await context.approvalRepository.getById("ap2")).toEqual({
      id: "ap2",
      artifactId: "a2",
      approvedBy: "owner2",
      evidence: { id: "ev2", source: "test", uri: "urn:test:two" },
    });

    await context.readinessReportRepository.save({
      projectId: "p2",
      generatedAt: "2026-01-02T00:00:00.000Z",
      gates: [{ gateId: "g1", passed: false, reasons: ["x"] }],
    });
    await context.readinessReportRepository.save({
      projectId: "p2",
      generatedAt: "2026-01-02T00:01:00.000Z",
      gates: [{ gateId: "g1", passed: true, reasons: [] }],
    });
    expect(
      await context.readinessReportRepository.getByProjectId("p2"),
    ).toEqual({
      projectId: "p2",
      generatedAt: "2026-01-02T00:01:00.000Z",
      gates: [{ gateId: "g1", passed: true, reasons: [] }],
    });

    await context.productionBriefRepository.save({
      projectId: "p2",
      summary: "old",
      generatedAt: "2026-01-02T00:00:00.000Z",
    });
    await context.productionBriefRepository.save({
      projectId: "p2",
      summary: "new",
      generatedAt: "2026-01-02T00:01:00.000Z",
    });
    expect(
      await context.productionBriefRepository.getByProjectId("p2"),
    ).toEqual({
      projectId: "p2",
      summary: "new",
      generatedAt: "2026-01-02T00:01:00.000Z",
    });

    await context.dispose?.();
  });

  it("persists project and artifact between instances on same file", async () => {
    const dbPath = await createTempDbPath();
    const provider = new SqlitePersistenceProvider();
    const config = buildSqlitePersistenceConfig({
      persistence: { kind: "sqlite", sqlitePath: dbPath },
    });

    const writer = await provider.createPersistence(config);
    await writer.projectRepository.save({
      id: "persist-p",
      name: "Persist",
      createdAt: "2026-01-03T00:00:00.000Z",
    });
    await writer.artifactRepository.save({
      id: "persist-a" as unknown as import("../../src/domain").ArtifactId,
      title: "Persist Artifact",
      status: "draft",
      version: { major: 1, minor: 0, patch: 0 },
    });
    await writer.dispose?.();

    const reader = await provider.createPersistence(config);
    expect(await reader.projectRepository.getById("persist-p")).toEqual({
      id: "persist-p",
      name: "Persist",
      createdAt: "2026-01-03T00:00:00.000Z",
    });
    expect(await reader.artifactRepository.getById("persist-a")).toEqual({
      id: "persist-a" as unknown as import("../../src/domain").ArtifactId,
      title: "Persist Artifact",
      status: "draft",
      version: { major: 1, minor: 0, patch: 0 },
    });
    await reader.dispose?.();
  });
});
