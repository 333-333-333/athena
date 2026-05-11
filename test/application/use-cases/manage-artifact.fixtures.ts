export const manageArtifactFixtures = {
  command: {
    artifactId: "FUN-001",
    kind: "functional",
    title: "Persist metadata",
    subject: "Athena",
    normativeLevel: "must",
    requirement: "persist project metadata",
    priority: "high",
  },
  expectedStatement: "Athena MUST persist project metadata.",
} as const;
