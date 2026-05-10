import type { EvidenceRef } from "../value-objects/evidence-ref";
export interface Approval {
  readonly id: string;
  readonly artifactId: string;
  readonly approvedBy: string;
  readonly evidence?: EvidenceRef;
}
