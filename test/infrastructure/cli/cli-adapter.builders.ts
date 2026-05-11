import { InitializeProjectService } from "../../../src/application";
import type { AppComposition } from "../../../src/composition-root";
import { InMemoryProjectRepository } from "../../../src/infrastructure";

export const buildCliComposition = (): AppComposition => {
  const projectRepository = new InMemoryProjectRepository();

  return {
    config: {
      env: "test",
      persistence: { kind: "memory", sqlitePath: ":memory:" },
    },
    persistence: {
      projectRepository,
      artifactRepository:
        {} as AppComposition["persistence"]["artifactRepository"],
      approvalRepository:
        {} as AppComposition["persistence"]["approvalRepository"],
      readinessReportRepository:
        {} as AppComposition["persistence"]["readinessReportRepository"],
      productionBriefRepository:
        {} as AppComposition["persistence"]["productionBriefRepository"],
      traceLinkRepository:
        {} as AppComposition["persistence"]["traceLinkRepository"],
    },
    useCases: {
      initializeProject: new InitializeProjectService(projectRepository),
      manageArtifact: {} as AppComposition["useCases"]["manageArtifact"],
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
