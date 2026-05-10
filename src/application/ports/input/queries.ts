export interface CheckSpecificationGapsQuery {
  readonly projectId: string;
}
export interface CheckReadinessQuery {
  readonly projectId: string;
}
export interface GenerateProductionBriefQuery {
  readonly projectId: string;
}
export interface GenerateDocsQuery {
  readonly projectId: string;
}
export interface ScanRepositoryQuery {
  readonly rootPath: string;
}
export interface ManageTraceabilityQuery {
  readonly projectId: string;
}
