import type { Approval } from "../../../src/domain";

export const buildApproval = (overrides: Partial<Approval> = {}): Approval => ({
  id: overrides.id ?? "approval-1",
  artifactId: overrides.artifactId ?? "artifact-1",
  approvedBy: overrides.approvedBy ?? "team",
  evidence: overrides.evidence,
});
