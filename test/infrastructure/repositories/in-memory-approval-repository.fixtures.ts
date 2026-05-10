import type { Approval } from "../../../src/domain";

export const inMemoryApprovalRepositoryFixtures = {
  approval: {
    id: "approval-1",
    artifactId: "artifact-1",
    approvedBy: "team",
  } satisfies Approval,
} as const;
