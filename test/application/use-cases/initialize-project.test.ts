import { describe, expect, it } from "bun:test";
import { InitializeProjectService } from "../../../src/application";
import { InMemoryProjectRepository } from "../../../src/infrastructure";
import { buildInitializeProjectCommand } from "./initialize-project.builders";
import { initializeProjectFixtures } from "./initialize-project.fixtures";

describe("initialize-project", () => {
  it("persists project metadata", async () => {
    const repository = new InMemoryProjectRepository();
    const service = new InitializeProjectService(repository);

    const project = await service.execute(buildInitializeProjectCommand());

    expect(project).toEqual(initializeProjectFixtures.project);
    expect(await repository.getById("athena")).toEqual(
      initializeProjectFixtures.project,
    );
  });

  it("is idempotent for the same project id", async () => {
    const repository = new InMemoryProjectRepository();
    const service = new InitializeProjectService(repository);

    await service.execute(buildInitializeProjectCommand());
    const project = await service.execute(
      buildInitializeProjectCommand({
        projectName: "Athena Updated",
        createdAt: "2026-05-11T00:00:00.000Z",
      }),
    );

    expect(project).toEqual(initializeProjectFixtures.updatedProject);
    expect(await repository.getById("athena")).toEqual(
      initializeProjectFixtures.updatedProject,
    );
  });
});
