import type { InitializeProjectCommand } from "../../../src/application/ports/input";

export const buildInitializeProjectCommand = (
  overrides: Partial<InitializeProjectCommand> = {},
): InitializeProjectCommand => ({
  projectId: overrides.projectId ?? "athena",
  projectName: overrides.projectName ?? "Athena",
  createdAt: overrides.createdAt ?? "2026-05-10T00:00:00.000Z",
});
