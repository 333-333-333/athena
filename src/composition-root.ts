import {
  CheckReadinessService,
  CheckSpecificationGapsService,
  FeatureStatusService,
  GenerateDocsService,
  GenerateProductionBriefService,
  InitializeProjectService,
  ManageArtifactService,
  ManageFeatureService,
  ManageLifecycleService,
  ManageTraceabilityService,
  ProjectStatusService,
  RegisterApprovalService,
  ScanRepositoryService,
} from "./application";
import {
  type AthenaConfig,
  loadAthenaConfig,
  validateAthenaConfig,
} from "./infrastructure/config/athena-config";
import {
  type PersistenceContext,
  selectPersistenceProvider,
} from "./infrastructure/persistence-provider";

export interface AppComposition {
  readonly config: AthenaConfig;
  readonly persistence: PersistenceContext;
  readonly useCases: {
    readonly initializeProject: InitializeProjectService;
    readonly manageArtifact: ManageArtifactService;
    readonly manageFeature: ManageFeatureService;
    readonly manageLifecycle: ManageLifecycleService;
    readonly registerApproval: RegisterApprovalService;
    readonly checkSpecificationGaps: CheckSpecificationGapsService;
    readonly checkReadiness: CheckReadinessService;
    readonly generateProductionBrief: GenerateProductionBriefService;
    readonly generateDocs: GenerateDocsService;
    readonly scanRepository: ScanRepositoryService;
    readonly manageTraceability: ManageTraceabilityService;
    readonly projectStatus: ProjectStatusService;
    readonly featureStatus: FeatureStatusService;
  };
}

export const createAppComposition = async (
  inputConfig: AthenaConfig = loadAthenaConfig(),
): Promise<AppComposition> => {
  const config = validateAthenaConfig(inputConfig);
  const provider = selectPersistenceProvider(config.persistence.kind);
  const persistence = await provider.createPersistence(config);

  return {
    config,
    persistence,
    useCases: {
      initializeProject: new InitializeProjectService(
        persistence.projectRepository,
      ),
      manageArtifact: new ManageArtifactService(
        persistence.artifactRepository,
        persistence.featureRepository,
      ),
      manageFeature: new ManageFeatureService(persistence.featureRepository),
      manageLifecycle: new ManageLifecycleService(),
      registerApproval: new RegisterApprovalService(),
      checkSpecificationGaps: new CheckSpecificationGapsService(),
      checkReadiness: new CheckReadinessService(),
      generateProductionBrief: new GenerateProductionBriefService(),
      generateDocs: new GenerateDocsService(),
      scanRepository: new ScanRepositoryService(),
      manageTraceability: new ManageTraceabilityService(
        persistence.traceLinkRepository,
      ),
      projectStatus: new ProjectStatusService(
        persistence.projectRepository,
        persistence.featureRepository,
        persistence.artifactRepository,
        persistence.traceLinkRepository,
      ),
      featureStatus: new FeatureStatusService(
        persistence.featureRepository,
        persistence.artifactRepository,
        persistence.traceLinkRepository,
      ),
    },
  };
};
