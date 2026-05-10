import type { GateResult } from "../value-objects/gate-result";
export interface ReadinessReport {
  readonly projectId: string;
  readonly generatedAt: string;
  readonly gates: readonly GateResult[];
}
