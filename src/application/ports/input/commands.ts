import type { NormativeLevel, RequirementKind } from "../../../domain";

export interface InitializeProjectCommand {
  readonly projectId: string;
  readonly projectName: string;
  readonly createdAt?: string;
}
export interface ManageArtifactCommand {
  readonly artifactId: string;
  readonly kind: RequirementKind;
  readonly title: string;
  readonly subject: string;
  readonly normativeLevel: NormativeLevel;
  readonly requirement: string;
  readonly priority: string;
  readonly featureId?: string;
}

export interface UpdateArtifactCommand {
  readonly artifactId?: string;
  readonly kind?: RequirementKind;
  readonly title?: string;
  readonly subject?: string;
  readonly normativeLevel?: NormativeLevel;
  readonly requirement?: string;
  readonly priority?: string;
  readonly featureId?: string;
}
export interface ManageLifecycleCommand {
  readonly artifactId: string;
  readonly targetStatus: string;
}
export interface RegisterApprovalCommand {
  readonly artifactId: string;
  readonly approvedBy: string;
}
