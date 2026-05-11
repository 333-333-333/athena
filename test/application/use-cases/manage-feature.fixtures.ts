import { buildManageFeatureCommand } from "./manage-feature.builders";
export const manageFeatureFixtures = {
  create: buildManageFeatureCommand(),
  update: buildManageFeatureCommand({
    name: "Feature CRUD Updated",
    status: "active",
    updatedAt: "2026-05-10T01:00:00.000Z",
  }),
  missingId: "feature-missing",
};
