import type { ManageArtifactCommand } from "../../../src/application/ports/input";

export const buildManageArtifactCommand = (
  overrides: Partial<ManageArtifactCommand> = {},
): ManageArtifactCommand =>
  ({
    artifactId: overrides.artifactId ?? "FUN-001",
    kind: overrides.kind ?? "functional",
    title: overrides.title ?? "Persist metadata",
    subject: overrides.subject ?? "Athena",
    normativeLevel: overrides.normativeLevel ?? "must",
    requirement: overrides.requirement ?? "persist project metadata",
    priority: overrides.priority ?? "high",
    featureId: overrides.featureId,
  }) as ManageArtifactCommand;
