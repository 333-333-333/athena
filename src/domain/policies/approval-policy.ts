import type { Approval } from "../entities/approval";
export interface ApprovalPolicy {
  isValid(approval: Approval): boolean;
}
