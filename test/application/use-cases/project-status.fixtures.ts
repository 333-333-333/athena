import { buildRequirement } from "./project-status.builders";

export const projectStatusFixtures = {
  requirements: [
    buildRequirement({
      id: "FUN-001" as never,
      details: {
        subject: "Athena",
        normativeLevel: "must",
        requirement: "a",
        statement: "Athena MUST a.",
        featureId: "F1",
      } as never,
    }),
    buildRequirement({
      id: "FUN-002" as never,
      details: {
        subject: "Athena",
        normativeLevel: "must",
        requirement: "b",
        statement: "Athena MUST b.",
        featureId: "",
      } as never,
    }),
    buildRequirement({
      id: "FUN-003" as never,
      details: {
        subject: "Athena",
        normativeLevel: "must",
        requirement: "c",
        statement: "Athena MUST c.",
        featureId: "MISSING",
      } as never,
    }),
  ],
};
