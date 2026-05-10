import type { TraceLink } from "../value-objects/trace-link";
export interface TraceabilityPolicy {
  validate(links: readonly TraceLink[]): boolean;
}
