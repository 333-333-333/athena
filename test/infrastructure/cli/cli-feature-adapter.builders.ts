export const buildFeatureCliArgv = (id = "feature-crud") => [
  "node",
  "athena",
  "feature",
  "create",
  id,
  "--name",
  "Feature CRUD",
  "--description",
  "Gestionar CRUD",
];
