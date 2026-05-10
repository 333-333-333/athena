import type { ApprovalRepository } from "../../application";
import type { Approval } from "../../domain";

export class InMemoryApprovalRepository implements ApprovalRepository {
  private readonly approvals = new Map<string, Approval>();

  async save(approval: Approval): Promise<void> {
    this.approvals.set(approval.id, {
      ...approval,
      evidence:
        approval.evidence === undefined ? undefined : { ...approval.evidence },
    });
  }

  async getById(approvalId: string): Promise<Approval | null> {
    const approval = this.approvals.get(approvalId);

    if (approval === undefined) {
      return null;
    }

    return {
      ...approval,
      evidence:
        approval.evidence === undefined ? undefined : { ...approval.evidence },
    };
  }
}
