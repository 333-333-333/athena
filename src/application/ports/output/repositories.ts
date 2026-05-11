import type {
  Approval,
  Feature,
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
  create(artifact: KnowledgeArtifact): Promise<void>;
  getById(artifactId: string): Promise<KnowledgeArtifact | null>;
  list(): Promise<KnowledgeArtifact[]>;
  update(artifactId: string, artifact: KnowledgeArtifact): Promise<void>;
  delete(artifactId: string): Promise<void>;
  save(artifact: KnowledgeArtifact): Promise<void>;
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

export interface FeatureRepository {
  create(feature: Feature): Promise<void>;
  getById(id: string): Promise<Feature | null>;
  list(): Promise<Feature[]>;
  update(
    id: string,
    changes: Partial<Omit<Feature, "id" | "createdAt">>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
