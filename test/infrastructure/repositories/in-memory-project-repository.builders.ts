export const buildProject = (
  overrides: Partial<{ id: string; name: string; createdAt: string }> = {},
) => ({
  id: overrides.id ?? "project-1",
  name: overrides.name ?? "Athena",
  createdAt: overrides.createdAt ?? "2026-05-10T00:00:00.000Z",
});
