import type {
  CheckReadinessQuery,
  CheckSpecificationGapsQuery,
  GenerateDocsQuery,
  GenerateProductionBriefQuery,
  ManageTraceabilityQuery,
  ScanRepositoryQuery,
} from "./queries";
import type {
  InitializeProjectCommand,
  ManageArtifactCommand,
  ManageLifecycleCommand,
  RegisterApprovalCommand,
} from "./commands";
export interface InitializeProjectUseCase {
  execute(command: InitializeProjectCommand): Promise<void>;
}
export interface ManageArtifactUseCase {
  execute(command: ManageArtifactCommand): Promise<void>;
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
