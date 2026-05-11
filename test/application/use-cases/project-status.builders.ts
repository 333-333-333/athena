import type { Requirement } from "../../../src/domain";

export const buildRequirement = (
  overrides: Partial<Requirement> = {},
): Requirement => ({
  id: (overrides.id ?? "FUN-001") as Requirement["id"],
  title: overrides.title ?? "Req",
  kind: overrides.kind ?? "functional",
  priority: overrides.priority ?? "high",
  status: overrides.status ?? "draft",
  version: overrides.version ?? { major: 1, minor: 0, patch: 0 },
  details: overrides.details ?? {
    subject: "Athena",
    normativeLevel: "must",
    requirement: "do thing",
    statement: "Athena MUST do thing.",
    featureId: "F1",
  },
});
