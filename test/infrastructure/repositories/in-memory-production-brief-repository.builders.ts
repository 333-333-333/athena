import type { ProductionBrief } from "../../../src/domain";

export const buildProductionBrief = (
  overrides: Partial<ProductionBrief> = {},
): ProductionBrief => ({
  projectId: overrides.projectId ?? "project-1",
  summary: overrides.summary ?? "Ready",
  generatedAt: overrides.generatedAt ?? "2026-05-10T00:00:00.000Z",
});
