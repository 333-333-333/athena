import type {
  ApprovalRepository,
  ArtifactRepository,
  ProductionBriefRepository,
  ProjectRepository,
  ReadinessReportRepository,
} from "../application";
import type {
  AthenaConfig,
  AthenaPersistenceKind,
} from "./config/athena-config";
import { InMemoryApprovalRepository } from "./repositories/in-memory-approval-repository";
import { InMemoryArtifactRepository } from "./repositories/in-memory-artifact-repository";
import { InMemoryProductionBriefRepository } from "./repositories/in-memory-production-brief-repository";
import { InMemoryProjectRepository } from "./repositories/in-memory-project-repository";
import { InMemoryReadinessReportRepository } from "./repositories/in-memory-readiness-report-repository";

export interface PersistenceContext {
  readonly projectRepository: ProjectRepository;
  readonly artifactRepository: ArtifactRepository;
  readonly approvalRepository: ApprovalRepository;
  readonly readinessReportRepository: ReadinessReportRepository;
  readonly productionBriefRepository: ProductionBriefRepository;
}

export interface PersistenceProvider {
  readonly kind: AthenaPersistenceKind;
  createPersistence(config: AthenaConfig): Promise<PersistenceContext>;
}

export class InMemoryPersistenceProvider implements PersistenceProvider {
  readonly kind = "memory" as const;

  async createPersistence(_config: AthenaConfig): Promise<PersistenceContext> {
    return {
      projectRepository: new InMemoryProjectRepository(),
      artifactRepository: new InMemoryArtifactRepository(),
      approvalRepository: new InMemoryApprovalRepository(),
      readinessReportRepository: new InMemoryReadinessReportRepository(),
      productionBriefRepository: new InMemoryProductionBriefRepository(),
    };
  }
}

export class Neo4jPersistenceProvider implements PersistenceProvider {
  readonly kind = "neo4j" as const;

  async createPersistence(_config: AthenaConfig): Promise<PersistenceContext> {
    return {
      projectRepository: new InMemoryProjectRepository(),
      artifactRepository: new InMemoryArtifactRepository(),
      approvalRepository: new InMemoryApprovalRepository(),
      readinessReportRepository: new InMemoryReadinessReportRepository(),
      productionBriefRepository: new InMemoryProductionBriefRepository(),
    };
  }
}

export const selectPersistenceProvider = (
  kind: AthenaPersistenceKind,
): PersistenceProvider => {
  switch (kind) {
    case "memory":
      return new InMemoryPersistenceProvider();
    case "neo4j":
      return new Neo4jPersistenceProvider();
  }
};
