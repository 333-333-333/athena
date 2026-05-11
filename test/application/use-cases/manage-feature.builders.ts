export const buildManageFeatureCommand = (
  overrides: Partial<{
    id: string;
    name: string;
    description: string;
    status: "draft" | "active" | "archived";
    updatedAt: string;
  }> = {},
) => ({
  id: overrides.id ?? "feature-crud",
  name: overrides.name ?? "Feature CRUD",
  description: overrides.description ?? "Gestionar CRUD de features",
  status: overrides.status ?? "draft",
  updatedAt: overrides.updatedAt ?? "2026-05-10T00:00:00.000Z",
});
