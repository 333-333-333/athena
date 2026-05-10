export interface GateResult {
  readonly gateId: string;
  readonly passed: boolean;
  readonly reasons: readonly string[];
}
