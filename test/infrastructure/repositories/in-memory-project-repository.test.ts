import { describe, expect, it } from "bun:test";
import { InMemoryProjectRepository } from "../../../src/infrastructure/repositories/in-memory-project-repository";
import { buildProject } from "./in-memory-project-repository.builders";
import { inMemoryProjectRepositoryFixtures } from "./in-memory-project-repository.fixtures";

describe("in-memory-project-repository", () => {
  it("saves and reads a project", async () => {
    const repository = new InMemoryProjectRepository();
    await repository.save(buildProject());
    expect(
      await repository.getById(inMemoryProjectRepositoryFixtures.project.id),
    ).toEqual(inMemoryProjectRepositoryFixtures.project);
  });

  it("returns null for missing project", async () => {
    const repository = new InMemoryProjectRepository();
    expect(await repository.getById("missing")).toBeNull();
  });

  it("overwrites same project id", async () => {
    const repository = new InMemoryProjectRepository();
    await repository.save(buildProject());
    await repository.save(buildProject({ name: "Athena Updated" }));
    expect(await repository.getById("project-1")).toEqual(
      inMemoryProjectRepositoryFixtures.updatedProject,
    );
  });
});
