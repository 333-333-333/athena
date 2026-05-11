import type { Project } from "../../../domain";
import type {
  InitializeProjectCommand,
  ManageArtifactCommand,
  ManageLifecycleCommand,
  RegisterApprovalCommand,
  UpdateArtifactCommand,
} from "./commands";
import type {
  CheckReadinessQuery,
  CheckSpecificationGapsQuery,
  GenerateDocsQuery,
  GenerateProductionBriefQuery,
  ManageTraceabilityQuery,
  ScanRepositoryQuery,
} from "./queries";
export interface InitializeProjectUseCase {
  execute(command: InitializeProjectCommand): Promise<Project>;
}
export interface ManageArtifactUseCase {
  execute(command: ManageArtifactCommand): Promise<void>;
  get(
    artifactId: string,
  ): Promise<import("../../../domain").Requirement | null>;
  list(): Promise<import("../../../domain").Requirement[]>;
  update(artifactId: string, command: UpdateArtifactCommand): Promise<void>;
  delete(artifactId: string): Promise<void>;
}
export interface ManageLifecycleUseCase {
  execute(command: ManageLifecycleCommand): Promise<void>;
}
export interface RegisterApprovalUseCase {
  execute(command: RegisterApprovalCommand): Promise<void>;
}
export interface CheckSpecificationGapsUseCase {
  execute(query: CheckSpecificationGapsQuery): Promise<void>;
}
export interface CheckReadinessUseCase {
  execute(query: CheckReadinessQuery): Promise<void>;
}
export interface GenerateProductionBriefUseCase {
  execute(query: GenerateProductionBriefQuery): Promise<void>;
}
export interface GenerateDocsUseCase {
  execute(query: GenerateDocsQuery): Promise<void>;
}
export interface ScanRepositoryUseCase {
  execute(query: ScanRepositoryQuery): Promise<void>;
}
export interface ManageTraceabilityUseCase {
  execute(query: ManageTraceabilityQuery): Promise<void>;
}
