import { describe, expect, it } from "bun:test";
import { ManageArtifactService } from "../../../src/application";
import {
  InMemoryArtifactRepository,
  InMemoryFeatureRepository,
} from "../../../src/infrastructure";
import { buildManageArtifactCommand } from "./manage-artifact.builders";

describe("application/use-cases/manage-artifact.ts", () => {
  it("creates/gets/lists/updates/deletes requirement", async () => {
    const repository = new InMemoryArtifactRepository();
    const service = new ManageArtifactService(
      repository,
      new InMemoryFeatureRepository(),
    );

    await service.execute(buildManageArtifactCommand());
    expect((await service.get("FUN-001"))?.details.statement).toBe(
      "Athena MUST persist project metadata.",
    );
    expect((await service.list()).length).toBe(1);

    await service.update(
      "FUN-001",
      buildManageArtifactCommand({
        artifactId: "FUN-001",
        requirement: "persist metadata safely",
      }),
    );
    expect((await service.get("FUN-001"))?.details.statement).toBe(
      "Athena MUST persist metadata safely.",
    );

    await service.delete("FUN-001");
    expect(await service.get("FUN-001")).toBeNull();
  });

  it("fails create on duplicate", async () => {
    const service = new ManageArtifactService(
      new InMemoryArtifactRepository(),
      new InMemoryFeatureRepository(),
    );
    await service.execute(buildManageArtifactCommand());
    await expect(service.execute(buildManageArtifactCommand())).rejects.toThrow(
      "artifact already exists",
    );
  });

  it("fails update/delete on missing", async () => {
    const service = new ManageArtifactService(
      new InMemoryArtifactRepository(),
      new InMemoryFeatureRepository(),
    );
    await expect(
      service.update(
        "MISSING",
        buildManageArtifactCommand({ artifactId: "MISSING" }),
      ),
    ).rejects.toThrow("artifact not found");
    await expect(service.delete("MISSING")).rejects.toThrow(
      "artifact not found",
    );
  });

  it("validates featureId on create and update", async () => {
    const artifactRepository = new InMemoryArtifactRepository();
    const featureRepository = new InMemoryFeatureRepository();
    const service = new ManageArtifactService(
      artifactRepository,
      featureRepository,
    );

    await expect(
      service.execute(buildManageArtifactCommand({ featureId: "NOPE" })),
    ).rejects.toThrow("feature not found");

    await featureRepository.create({
      id: "PERSISTENCE",
      name: "Persistence",
      description: "Persistence",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await service.execute(
      buildManageArtifactCommand({ featureId: "PERSISTENCE" }),
    );
    expect((await service.get("FUN-001"))?.details.featureId).toBe(
      "PERSISTENCE",
    );

    await expect(
      service.update(
        "FUN-001",
        buildManageArtifactCommand({
          artifactId: "FUN-001",
          featureId: "NOPE",
        }),
      ),
    ).rejects.toThrow("feature not found");
  });

  it("preserves validations for subject, normativeLevel might and requirement", async () => {
    const service = new ManageArtifactService(
      new InMemoryArtifactRepository(),
      new InMemoryFeatureRepository(),
    );
    await expect(
      service.execute(buildManageArtifactCommand({ subject: "   " })),
    ).rejects.toThrow("subject must not be empty");
    await expect(
      service.execute(
        buildManageArtifactCommand({ normativeLevel: "might" as never }),
      ),
    ).rejects.toThrow(
      "normativeLevel must be one of: must, must_not, should, should_not, may",
    );
    await expect(
      service.execute(buildManageArtifactCommand({ requirement: "" })),
    ).rejects.toThrow("requirement must not be empty");
  });

  it("updates only featureId and preserves title/kind/priority/details/statement", async () => {
    const artifactRepository = new InMemoryArtifactRepository();
    const featureRepository = new InMemoryFeatureRepository();
    const service = new ManageArtifactService(
      artifactRepository,
      featureRepository,
    );

    await featureRepository.create({
      id: "PERSISTENCE",
      name: "Persistence",
      description: "Persistence",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    await featureRepository.create({
      id: "CLI_ADAPTERS",
      name: "CLI Adapters",
      description: "CLI",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await service.execute(
      buildManageArtifactCommand({ featureId: "PERSISTENCE" }),
    );
    const before = await service.get("FUN-001");

    await service.update("FUN-001", { featureId: "CLI_ADAPTERS" });
    const after = await service.get("FUN-001");

    expect(after?.title).toBe(before?.title);
    expect(after?.kind).toBe(before?.kind);
    expect(after?.priority).toBe(before?.priority);
    expect(after?.details.subject).toBe(before?.details.subject);
    expect(after?.details.normativeLevel).toBe(before?.details.normativeLevel);
    expect(after?.details.requirement).toBe(before?.details.requirement);
    expect(after?.details.statement).toBe(before?.details.statement);
    expect(after?.details.featureId).toBe("CLI_ADAPTERS");
  });

  it("updates only title and preserves details", async () => {
    const service = new ManageArtifactService(
      new InMemoryArtifactRepository(),
      new InMemoryFeatureRepository(),
    );
    await service.execute(buildManageArtifactCommand());
    const before = await service.get("FUN-001");

    await service.update("FUN-001", { title: "Persist metadata v2" });
    const after = await service.get("FUN-001");

    expect(after?.title).toBe("Persist metadata v2");
    expect(after?.details.subject).toBe(before?.details.subject);
    expect(after?.details.normativeLevel).toBe(before?.details.normativeLevel);
    expect(after?.details.requirement).toBe(before?.details.requirement);
    expect(after?.details.statement).toBe(before?.details.statement);
  });

  it("recalculates statement when requirement text changes", async () => {
    const service = new ManageArtifactService(
      new InMemoryArtifactRepository(),
      new InMemoryFeatureRepository(),
    );
    await service.execute(buildManageArtifactCommand());

    await service.update("FUN-001", { requirement: "persist metadata safely" });

    expect((await service.get("FUN-001"))?.details.statement).toBe(
      "Athena MUST persist metadata safely.",
    );
  });
});
