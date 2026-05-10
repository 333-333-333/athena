import type { ReadinessReport } from "../../../src/domain";

export const inMemoryReadinessReportRepositoryFixtures = {
  report: {
    projectId: "project-1",
    generatedAt: "2026-05-10T00:00:00.000Z",
    gates: [],
  } satisfies ReadinessReport,
} as const;
