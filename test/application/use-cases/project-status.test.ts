import { describe, expect, it } from "bun:test";
import { ProjectStatusService } from "../../../src/application/use-cases/project-status";
import { createFeature } from "../../../src/domain";
import { InMemoryArtifactRepository } from "../../../src/infrastructure/repositories/in-memory-artifact-repository";
import { InMemoryFeatureRepository } from "../../../src/infrastructure/repositories/in-memory-feature-repository";
import { InMemoryProjectRepository } from "../../../src/infrastructure/repositories/in-memory-project-repository";
import { InMemoryTraceLinkRepository } from "../../../src/infrastructure/repositories/in-memory-trace-link-repository";
import { projectStatusFixtures } from "./project-status.fixtures";

describe("application/use-cases/project-status", () => {
  it("builds summary with counts and gaps", async () => {
    const projectRepository = new InMemoryProjectRepository();
    const featureRepository = new InMemoryFeatureRepository();
    const artifactRepository = new InMemoryArtifactRepository();
    const traceLinkRepository = new InMemoryTraceLinkRepository();

    await projectRepository.save({
      id: "athena",
      name: "Athena",
      createdAt: "2026-05-11T00:00:00.000Z",
    });
    await featureRepository.create(
      createFeature({
        id: "F1",
        name: "Feature 1",
        description: "d",
        status: "draft",
        createdAt: "2026-05-11T00:00:00.000Z",
        updatedAt: "2026-05-11T00:00:00.000Z",
      }),
    );
    await featureRepository.create(
      createFeature({
        id: "F2",
        name: "Feature 2",
        description: "d",
        status: "draft",
        createdAt: "2026-05-11T00:00:00.000Z",
        updatedAt: "2026-05-11T00:00:00.000Z",
      }),
    );
    for (const requirement of projectStatusFixtures.requirements)
      await artifactRepository.create(requirement as never);
    await traceLinkRepository.save({
      fromId: "FUN-001",
      toId: "F1",
      type: "belongs_to_feature",
    });

    const status = await new ProjectStatusService(
      projectRepository,
      featureRepository,
      artifactRepository,
      traceLinkRepository,
    ).execute();
    expect(status.project).toEqual({ id: "athena", name: "Athena" });
    expect(status.counts).toEqual({
      features: 2,
      requirements: 3,
      traceLinks: 1,
    });
    expect(status.gaps.requirementsWithoutFeature).toEqual({
      count: 2,
      ids: ["FUN-002", "FUN-003"],
    });
    expect(status.gaps.featuresWithoutRequirements).toEqual({
      count: 1,
      ids: ["F2"],
    });
  });
});
