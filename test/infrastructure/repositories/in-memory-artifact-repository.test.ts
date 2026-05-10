import { describe, expect, it } from "bun:test";
import { InMemoryArtifactRepository } from "../../../src/infrastructure/repositories/in-memory-artifact-repository";
import { buildArtifact } from "./in-memory-artifact-repository.builders";
import { inMemoryArtifactRepositoryFixtures } from "./in-memory-artifact-repository.fixtures";

describe("in-memory-artifact-repository", () => {
  it("saves and reads an artifact", async () => {
    const repository = new InMemoryArtifactRepository();
    await repository.save(buildArtifact());
    expect(
      await repository.getById(inMemoryArtifactRepositoryFixtures.artifact.id),
    ).toEqual(inMemoryArtifactRepositoryFixtures.artifact);
  });

  it("returns null for missing artifact", async () => {
    const repository = new InMemoryArtifactRepository();
    expect(await repository.getById("missing")).toBeNull();
  });

  it("overwrites same artifact id", async () => {
    const repository = new InMemoryArtifactRepository();
    await repository.save(buildArtifact());
    await repository.save(
      buildArtifact({
        title: "Architecture Updated",
        status: "approved",
        version: { major: 1, minor: 1, patch: 0 },
      }),
    );
    expect(await repository.getById("artifact-1")).toEqual(
      inMemoryArtifactRepositoryFixtures.updatedArtifact,
    );
  });
});
