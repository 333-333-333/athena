export interface InitializeProjectCommand {
  readonly projectName: string;
}
export interface ManageArtifactCommand {
  readonly artifactId: string;
}
export interface ManageLifecycleCommand {
  readonly artifactId: string;
  readonly targetStatus: string;
}
export interface RegisterApprovalCommand {
  readonly artifactId: string;
  readonly approvedBy: string;
}
