import {
  InitializeProjectService,
  ManageArtifactService,
  ManageFeatureService,
} from "../../../src/application";
import type { AppComposition } from "../../../src/composition-root";
import {
  InMemoryArtifactRepository,
  InMemoryFeatureRepository,
  InMemoryProjectRepository,
  SqlitePersistenceProvider,
} from "../../../src/infrastructure";

export const buildCliComposition = (): AppComposition => {
  const projectRepository = new InMemoryProjectRepository();
  const artifactRepository = new InMemoryArtifactRepository();
  const featureRepository = new InMemoryFeatureRepository();

  return {
    config: {
      env: "test",
      persistence: { kind: "memory", sqlitePath: ":memory:" },
    },
    persistence: {
      projectRepository,
      artifactRepository,
      approvalRepository:
        {} as AppComposition["persistence"]["approvalRepository"],
      readinessReportRepository:
        {} as AppComposition["persistence"]["readinessReportRepository"],
      productionBriefRepository:
        {} as AppComposition["persistence"]["productionBriefRepository"],
      traceLinkRepository:
        {} as AppComposition["persistence"]["traceLinkRepository"],
      featureRepository,
    },
    useCases: {
      initializeProject: new InitializeProjectService(projectRepository),
      manageArtifact: new ManageArtifactService(
        artifactRepository,
        featureRepository,
      ),
      manageFeature: new ManageFeatureService(featureRepository),
      manageLifecycle: {} as AppComposition["useCases"]["manageLifecycle"],
      registerApproval: {} as AppComposition["useCases"]["registerApproval"],
      checkSpecificationGaps:
        {} as AppComposition["useCases"]["checkSpecificationGaps"],
      checkReadiness: {} as AppComposition["useCases"]["checkReadiness"],
      generateProductionBrief:
        {} as AppComposition["useCases"]["generateProductionBrief"],
      generateDocs: {} as AppComposition["useCases"]["generateDocs"],
      scanRepository: {} as AppComposition["useCases"]["scanRepository"],
      manageTraceability:
        {} as AppComposition["useCases"]["manageTraceability"],
    },
  };
};

export const buildSqliteCliComposition = async (
  sqlitePath: string,
): Promise<AppComposition> => {
  const provider = new SqlitePersistenceProvider();
  const persistence = await provider.createPersistence({
    env: "test",
    persistence: { kind: "sqlite", sqlitePath },
  });

  return {
    config: {
      env: "test",
      persistence: { kind: "sqlite", sqlitePath },
    },
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
      manageLifecycle: {} as AppComposition["useCases"]["manageLifecycle"],
      registerApproval: {} as AppComposition["useCases"]["registerApproval"],
      checkSpecificationGaps:
        {} as AppComposition["useCases"]["checkSpecificationGaps"],
      checkReadiness: {} as AppComposition["useCases"]["checkReadiness"],
      generateProductionBrief:
        {} as AppComposition["useCases"]["generateProductionBrief"],
      generateDocs: {} as AppComposition["useCases"]["generateDocs"],
      scanRepository: {} as AppComposition["useCases"]["scanRepository"],
      manageTraceability:
        {} as AppComposition["useCases"]["manageTraceability"],
    },
  };
};
