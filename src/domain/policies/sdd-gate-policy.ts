import type { GateResult } from "../value-objects/gate-result";
export interface SddGatePolicy {
  evaluate(projectId: string): Promise<readonly GateResult[]>;
}
