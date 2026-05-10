import type { GateResult, ReadinessReport } from "../../../src/domain";

export const buildReadinessReport = (
  overrides: Partial<{
    projectId: string;
    generatedAt: string;
    gates: readonly GateResult[];
  }> = {},
): ReadinessReport => ({
  projectId: overrides.projectId ?? "project-1",
  generatedAt: overrides.generatedAt ?? "2026-05-10T00:00:00.000Z",
  gates: overrides.gates ?? [],
});
