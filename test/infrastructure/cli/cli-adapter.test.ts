import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CliInterfaceAdapter } from "../../../src/infrastructure";
import {
  buildCliComposition,
  buildSqliteCliComposition,
} from "./cli-adapter.builders";
import { cliAdapterFixtures } from "./cli-adapter.fixtures";

const tempDirs: string[] = [];
const createTempDbPath = async () => {
  const dir = await mkdtemp(join(tmpdir(), "athena-cli-"));
  tempDirs.push(dir);
  return join(dir, "athena.sqlite");
};
afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("infrastructure/cli/cli-adapter.ts", () => {
  it("runs init command through initialize-project use case and prints friendly output", async () => {
    const composition = buildCliComposition();
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-10T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });
    await adapter.run(cliAdapterFixtures.argv);
    expect(
      await composition.persistence.projectRepository.getById("athena"),
    ).toMatchObject(cliAdapterFixtures.project);
    expect(output[0]).toBe("Initialized project athena (Athena)");
  });

  it("prints init JSON when --json is present", async () => {
    const composition = buildCliComposition();
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-10T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });
    await adapter.run(["init", "--id", "athena", "--name", "Athena", "--json"]);
    expect(output[0]).toContain('"id":"athena"');
  });

  it("routes --db through sqlite composition and keeps feature and requirement data alive", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const requestedSqlitePaths: Array<string | undefined> = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async ({ sqlitePath: requestedSqlitePath } = {}) => {
        requestedSqlitePaths.push(requestedSqlitePath);
        expect(requestedSqlitePath).toBe(sqlitePath);
        return composition;
      },
      now: () => "2026-05-10T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });

    await adapter.run([
      "--db",
      sqlitePath,
      "feature",
      "create",
      "PERSISTENCE",
      "--name",
      "Persistence",
      "--description",
      "Persistence feature",
    ]);
    await adapter.run(["feature", "list", "--db", sqlitePath]);
    await adapter.run([
      "requirement",
      "create",
      "--db",
      sqlitePath,
      "--id",
      "FUN-001",
      "--kind",
      "functional",
      "--title",
      "Persist metadata",
      "--subject",
      "Athena",
      "--level",
      "must",
      "--requirement",
      "persist project metadata",
      "--priority",
      "high",
      "--feature",
      "PERSISTENCE",
    ]);
    await adapter.run([
      "requirement",
      "update",
      "FUN-001",
      "--db",
      sqlitePath,
      "--id",
      "FUN-001",
      "--kind",
      "functional",
      "--title",
      "Persist metadata updated",
      "--subject",
      "Athena",
      "--level",
      "must",
      "--requirement",
      "persist project metadata safely",
      "--priority",
      "high",
      "--feature",
      "PERSISTENCE",
    ]);

    const artifact =
      await composition.persistence.artifactRepository.getById("FUN-001");
    const requirementArtifact = artifact as {
      details?: { featureId?: string; statement?: string };
    } | null;

    expect(requestedSqlitePaths).toEqual([
      sqlitePath,
      sqlitePath,
      sqlitePath,
      sqlitePath,
    ]);
    expect(
      output.some((line) => line.includes("Created feature PERSISTENCE")),
    ).toBe(true);
    expect(
      output.some((line) => line.includes("Created requirement FUN-001")),
    ).toBe(true);
    expect(
      output.some((line) => line.includes("Updated requirement FUN-001")),
    ).toBe(true);
    expect(requirementArtifact?.details?.featureId).toBe("PERSISTENCE");
    expect(requirementArtifact?.details?.statement).toBe(
      "Athena MUST persist project metadata safely.",
    );

    await composition.persistence.dispose?.();
  });

  it("prints friendly output for feature create/get/list by default", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-10T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });

    await adapter.run([
      "feature",
      "create",
      "CLI_OUTPUT",
      "--name",
      "CLI Output",
      "--description",
      "Feature for visible output",
    ]);
    await adapter.run(["feature", "get", "CLI_OUTPUT"]);
    await adapter.run(["feature", "list"]);

    expect(output[0]).toBe("Created feature CLI_OUTPUT");
    expect(output[1]).toContain("CLI_OUTPUT  CLI Output");
    expect(output[2]).toContain("CLI_OUTPUT  CLI Output");
    await composition.persistence.dispose?.();
  });

  it("prints JSON output for feature get/list/create with --json", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-10T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });

    await adapter.run([
      "feature",
      "create",
      "CLI_OUTPUT",
      "--name",
      "CLI Output",
      "--description",
      "Feature for visible output",
      "--json",
    ]);
    await adapter.run(["feature", "get", "CLI_OUTPUT", "--json"]);
    await adapter.run(["feature", "list", "--json"]);

    expect(
      output.every((line) => line.startsWith("{") || line.startsWith("[")),
    ).toBe(true);
    await composition.persistence.dispose?.();
  });

  it("runs requirement CRUD commands in sqlite including --feature and prints friendly output", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      writeLine: (line) => output.push(line),
    });

    await composition.useCases.manageFeature.create({
      id: "PERSISTENCE",
      name: "Persistence",
      description: "Persistence",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await adapter.run(cliAdapterFixtures.requirementCreateArgv);
    await adapter.run(["requirement", "get", "FUN-001"]);
    await adapter.run(["requirement", "list"]);
    await adapter.run(cliAdapterFixtures.requirementUpdateArgv);

    const artifact =
      await composition.persistence.artifactRepository.getById("FUN-001");
    const requirementArtifact = artifact as {
      details?: { featureId?: string; statement?: string };
    } | null;
    expect(requirementArtifact?.details?.featureId).toBe("PERSISTENCE");
    expect(requirementArtifact?.details?.statement).toBe(
      "Athena MUST persist project metadata safely.",
    );

    await adapter.run(["requirement", "delete", "FUN-001"]);
    expect(
      await composition.persistence.artifactRepository.getById("FUN-001"),
    ).toBeNull();

    expect(
      output.some((line) => line.includes("Created requirement FUN-001")),
    ).toBe(true);
    expect(
      output.some((line) => line.includes("Updated requirement FUN-001")),
    ).toBe(true);
    expect(
      output.some((line) => line.includes("Deleted requirement FUN-001")),
    ).toBe(true);
    expect(
      output.some((line) => line.includes("FUN-001  functional  PERSISTENCE")),
    ).toBe(true);
    await composition.persistence.dispose?.();
  });

  it("prints JSON output for requirement list/get/create/update/delete with --json", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      writeLine: (line) => output.push(line),
    });

    await composition.useCases.manageFeature.create({
      id: "PERSISTENCE",
      name: "Persistence",
      description: "Persistence",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await adapter.run([...cliAdapterFixtures.requirementCreateArgv, "--json"]);
    await adapter.run(["requirement", "get", "FUN-001", "--json"]);
    await adapter.run(["requirement", "list", "--json"]);
    await adapter.run([...cliAdapterFixtures.requirementUpdateArgv, "--json"]);
    await adapter.run(["requirement", "delete", "FUN-001", "--json"]);

    expect(output.some((line) => line.includes('"id":"FUN-001"'))).toBe(true);
    expect(output.some((line) => line.includes('"deleted":"FUN-001"'))).toBe(
      true,
    );
    await composition.persistence.dispose?.();
  });

  it("updates requirement with partial flags without wiping fields", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
    });

    await composition.useCases.manageFeature.create({
      id: "PERSISTENCE",
      name: "Persistence",
      description: "Persistence",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    await composition.useCases.manageFeature.create({
      id: "CLI_ADAPTERS",
      name: "CLI Adapters",
      description: "CLI",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await adapter.run([
      "requirement",
      "create",
      "--id",
      "FUN-001",
      "--kind",
      "functional",
      "--title",
      "Persist metadata",
      "--subject",
      "Athena",
      "--level",
      "must",
      "--requirement",
      "persist project metadata",
      "--priority",
      "high",
      "--feature",
      "PERSISTENCE",
    ]);

    await adapter.run([
      "requirement",
      "update",
      "FUN-001",
      "--feature",
      "CLI_ADAPTERS",
    ]);
    let updated = await composition.useCases.manageArtifact.get("FUN-001");
    expect(updated?.title).toBe("Persist metadata");
    expect(updated?.kind).toBe("functional");
    expect(updated?.priority).toBe("high");
    expect(updated?.details.subject).toBe("Athena");
    expect(updated?.details.requirement).toBe("persist project metadata");
    expect(updated?.details.statement).toBe(
      "Athena MUST persist project metadata.",
    );
    expect(updated?.details.featureId).toBe("CLI_ADAPTERS");

    await adapter.run([
      "requirement",
      "update",
      "FUN-001",
      "--title",
      "Persist metadata v2",
    ]);
    updated = await composition.useCases.manageArtifact.get("FUN-001");
    expect(updated?.title).toBe("Persist metadata v2");
    expect(updated?.details.requirement).toBe("persist project metadata");
    expect(updated?.details.statement).toBe(
      "Athena MUST persist project metadata.",
    );

    await adapter.run([
      "requirement",
      "update",
      "FUN-001",
      "--requirement",
      "persist metadata safely",
    ]);
    updated = await composition.useCases.manageArtifact.get("FUN-001");
    expect(updated?.details.statement).toBe(
      "Athena MUST persist metadata safely.",
    );

    await composition.persistence.dispose?.();
  });

  it("prints friendly project status summary", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-11T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });
    await adapter.run(["init", "--id", "athena", "--name", "Athena"]);
    await adapter.run(["feature", "create", "F1", "--name", "Feature 1"]);
    await adapter.run(["feature", "create", "F2", "--name", "Feature 2"]);
    await adapter.run([
      "requirement",
      "create",
      "FUN-001",
      "--title",
      "r1",
      "--subject",
      "Athena",
      "--level",
      "must",
      "--requirement",
      "x",
      "--priority",
      "high",
    ]);
    await adapter.run(["project", "status"]);
    const last = output[output.length - 1] ?? "";
    expect(last).toContain("Project: athena (Athena)");
    expect(last).toContain("Features: 2");
    expect(last).toContain("Requirements: 1");
    expect(last).toContain("Trace links: 0");
    expect(last).toContain("Requirements without feature: 1 [FUN-001]");
    expect(last).toContain("Features without requirements: 2 [F1, F2]");
    await composition.persistence.dispose?.();
  });

  it("prints project status JSON with --json", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-11T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });
    await adapter.run(["init", "--id", "athena", "--name", "Athena"]);
    await adapter.run(["project", "status", "--json"]);
    const last = output[output.length - 1] ?? "";
    expect(last).toContain('"project":{"id":"athena","name":"Athena"}');
    expect(last).toContain('"counts"');
    await composition.persistence.dispose?.();
  });

  it("supports trace create/list/delete with friendly and json output", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-11T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });

    await adapter.run([
      "trace",
      "create",
      "--from",
      "FUN-001",
      "--to",
      "FEATURE_MANAGEMENT",
      "--type",
      "belongs_to_feature",
    ]);
    await adapter.run(["trace", "list"]);
    await adapter.run(["trace", "list", "--artifact", "FUN-001", "--json"]);
    await adapter.run([
      "trace",
      "delete",
      "--from",
      "FUN-001",
      "--to",
      "FEATURE_MANAGEMENT",
      "--type",
      "belongs_to_feature",
    ]);

    expect(
      output.some((line) =>
        line.includes(
          "Created trace link FUN-001 -> FEATURE_MANAGEMENT [belongs_to_feature]",
        ),
      ),
    ).toBeTrue();
    expect(output.some((line) => line.includes("Trace links: 1"))).toBeTrue();
    expect(
      output.some((line) => line.includes('"fromId":"FUN-001"')),
    ).toBeTrue();
    expect(
      output.some((line) =>
        line.includes(
          "Deleted trace link FUN-001 -> FEATURE_MANAGEMENT [belongs_to_feature]",
        ),
      ),
    ).toBeTrue();
    await composition.persistence.dispose?.();
  });

  it("prints feature status friendly and json", async () => {
    const sqlitePath = await createTempDbPath();
    const composition = await buildSqliteCliComposition(sqlitePath);
    const output: string[] = [];
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-11T00:00:00.000Z",
      writeLine: (line) => output.push(line),
    });

    await adapter.run([
      "feature",
      "create",
      "FEATURE_MANAGEMENT",
      "--name",
      "Feature Management",
    ]);
    await adapter.run([
      "requirement",
      "create",
      "FUN-001",
      "--title",
      "req",
      "--subject",
      "Athena",
      "--level",
      "must",
      "--requirement",
      "manage feature state",
      "--priority",
      "high",
      "--feature",
      "FEATURE_MANAGEMENT",
    ]);
    await adapter.run([
      "trace",
      "create",
      "--from",
      "FUN-001",
      "--to",
      "FEATURE_MANAGEMENT",
      "--type",
      "belongs_to_feature",
    ]);

    await adapter.run(["feature", "status", "FEATURE_MANAGEMENT"]);
    await adapter.run(["feature", "status", "FEATURE_MANAGEMENT", "--json"]);

    const friendly =
      output.find((line) => line.includes("Feature: FEATURE_MANAGEMENT")) ?? "";
    const json = output[output.length - 1] ?? "";
    expect(friendly).toContain("Feature: FEATURE_MANAGEMENT");
    expect(friendly).toContain("Requirements: 1 [FUN-001]");
    expect(friendly).toContain("Trace links: 1");
    expect(json).toContain('"feature":{"id":"FEATURE_MANAGEMENT"');
    expect(json).toContain('"gaps"');
    await composition.persistence.dispose?.();
  });
});
