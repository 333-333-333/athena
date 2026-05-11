export const buildFeature = (
  overrides: Partial<{
    id: string;
    name: string;
    description: string;
    status: "draft" | "active" | "archived";
    createdAt: string;
    updatedAt: string;
  }> = {},
) => ({
  id: overrides.id ?? "feature-crud",
  name: overrides.name ?? "Feature CRUD",
  description: overrides.description ?? "Gestionar CRUD de features",
  status: overrides.status ?? "draft",
  createdAt: overrides.createdAt ?? "2026-05-10T00:00:00.000Z",
  updatedAt: overrides.updatedAt ?? "2026-05-10T00:00:00.000Z",
});
