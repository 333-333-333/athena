import { describe, expect, it } from "bun:test";
import { FeatureStatusService } from "../../../src/application/use-cases/feature-status";
import { createFeature } from "../../../src/domain";
import { InMemoryArtifactRepository } from "../../../src/infrastructure/repositories/in-memory-artifact-repository";
import { InMemoryFeatureRepository } from "../../../src/infrastructure/repositories/in-memory-feature-repository";
import { InMemoryTraceLinkRepository } from "../../../src/infrastructure/repositories/in-memory-trace-link-repository";

describe("application/use-cases/feature-status", () => {
  it("builds feature requirement and trace summary with gaps", async () => {
    const featureRepository = new InMemoryFeatureRepository();
    const artifactRepository = new InMemoryArtifactRepository();
    const traceLinkRepository = new InMemoryTraceLinkRepository();

    await featureRepository.create(
      createFeature({
        id: "FEATURE_MANAGEMENT",
        name: "Feature Management",
        description: "d",
        status: "draft",
        createdAt: "2026-05-11T00:00:00.000Z",
        updatedAt: "2026-05-11T00:00:00.000Z",
      }),
    );

    await artifactRepository.create({
      id: "FUN-001",
      kind: "functional",
      title: "r1",
      status: "draft",
      owner: "user",
      sourceRefs: [],
      priority: "high",
      tags: [],
      history: [],
      details: {
        subject: "Athena",
        normativeLevel: "must",
        requirement: "manage features",
        statement: "Athena MUST manage features.",
        featureId: "FEATURE_MANAGEMENT",
      },
      createdAt: "2026-05-11T00:00:00.000Z",
      updatedAt: "2026-05-11T00:00:00.000Z",
    } as never);

    await artifactRepository.create({
      id: "FUN-002",
      kind: "functional",
      title: "r2",
      status: "draft",
      owner: "user",
      sourceRefs: [],
      priority: "high",
      tags: [],
      history: [],
      details: {
        subject: "Athena",
        normativeLevel: "must",
        requirement: "list features",
        statement: "Athena MUST list features.",
        featureId: "FEATURE_MANAGEMENT",
      },
      createdAt: "2026-05-11T00:00:00.000Z",
      updatedAt: "2026-05-11T00:00:00.000Z",
    } as never);

    await traceLinkRepository.save({
      fromId: "FUN-001",
      toId: "FEATURE_MANAGEMENT",
      type: "belongs_to_feature",
    });

    const status = await new FeatureStatusService(
      featureRepository,
      artifactRepository,
      traceLinkRepository,
    ).execute("FEATURE_MANAGEMENT");

    expect(status.feature?.id).toBe("FEATURE_MANAGEMENT");
    expect(status.requirements).toEqual({
      count: 2,
      ids: ["FUN-001", "FUN-002"],
    });
    expect(status.traceLinks.count).toBe(1);
    expect(status.gaps.missingRequirements).toBeFalse();
    expect(status.gaps.requirementsWithoutTraceLink).toEqual(["FUN-002"]);
  });
});
