import type { ProductionBrief } from "../../../src/domain";

export const inMemoryProductionBriefRepositoryFixtures = {
  brief: {
    projectId: "project-1",
    summary: "Ready",
    generatedAt: "2026-05-10T00:00:00.000Z",
  } satisfies ProductionBrief,
} as const;
