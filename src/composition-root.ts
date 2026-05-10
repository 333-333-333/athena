import {
  CheckReadinessService,
  CheckSpecificationGapsService,
  GenerateDocsService,
  GenerateProductionBriefService,
  InitializeProjectService,
  ManageArtifactService,
  ManageLifecycleService,
  ManageTraceabilityService,
  RegisterApprovalService,
  ScanRepositoryService,
} from "./application";
export interface AppComposition {
  readonly useCases: {
    readonly initializeProject: InitializeProjectService;
    readonly manageArtifact: ManageArtifactService;
    readonly manageLifecycle: ManageLifecycleService;
    readonly registerApproval: RegisterApprovalService;
    readonly checkSpecificationGaps: CheckSpecificationGapsService;
    readonly checkReadiness: CheckReadinessService;
    readonly generateProductionBrief: GenerateProductionBriefService;
    readonly generateDocs: GenerateDocsService;
    readonly scanRepository: ScanRepositoryService;
    readonly manageTraceability: ManageTraceabilityService;
  };
}
export const createAppComposition = (): AppComposition => ({
  useCases: {
    initializeProject: new InitializeProjectService(),
    manageArtifact: new ManageArtifactService(),
    manageLifecycle: new ManageLifecycleService(),
    registerApproval: new RegisterApprovalService(),
    checkSpecificationGaps: new CheckSpecificationGapsService(),
    checkReadiness: new CheckReadinessService(),
    generateProductionBrief: new GenerateProductionBriefService(),
    generateDocs: new GenerateDocsService(),
    scanRepository: new ScanRepositoryService(),
    manageTraceability: new ManageTraceabilityService(),
  },
});
