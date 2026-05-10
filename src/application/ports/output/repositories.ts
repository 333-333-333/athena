import type {
  Approval,
  KnowledgeArtifact,
  ProductionBrief,
  Project,
  ReadinessReport,
  TraceLink,
} from "../../../domain";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  getById(projectId: string): Promise<Project | null>;
}

export interface ArtifactRepository {
  save(artifact: KnowledgeArtifact): Promise<void>;
  getById(artifactId: string): Promise<KnowledgeArtifact | null>;
}

export interface ApprovalRepository {
  save(approval: Approval): Promise<void>;
  getById(approvalId: string): Promise<Approval | null>;
}

export interface ReadinessReportRepository {
  save(report: ReadinessReport): Promise<void>;
  getByProjectId(projectId: string): Promise<ReadinessReport | null>;
}

export interface ProductionBriefRepository {
  save(brief: ProductionBrief): Promise<void>;
  getByProjectId(projectId: string): Promise<ProductionBrief | null>;
}

export interface TraceLinkRepository {
  save(link: TraceLink): Promise<void>;
  listByArtifactId(artifactId: string): Promise<TraceLink[]>;
  delete(link: TraceLink): Promise<void>;
}
