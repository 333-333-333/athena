import { buildFeatureCliArgv } from "./cli-feature-adapter.builders";
export const cliFeatureFixtures = {
  createArgv: buildFeatureCliArgv(),
  getArgv: ["node", "athena", "feature", "get", "feature-crud"],
  listArgv: ["node", "athena", "feature", "list"],
  updateArgv: [
    "node",
    "athena",
    "feature",
    "update",
    "feature-crud",
    "--name",
    "Updated",
  ],
  deleteArgv: ["node", "athena", "feature", "delete", "feature-crud"],
};
