import type { ReadinessReport } from "../entities/readiness-report";
export interface ReadinessPolicy {
  isReady(report: ReadinessReport): boolean;
}
