import type { Requirement, TraceLink } from "../../domain";
import type {
  ArtifactRepository,
  FeatureRepository,
  TraceLinkRepository,
} from "../ports/output";

export interface FeatureStatusSummary {
  readonly feature: { id: string; name: string; status: string } | null;
  readonly requirements: {
    readonly count: number;
    readonly ids: string[];
  };
  readonly traceLinks: {
    readonly count: number;
    readonly items: TraceLink[];
  };
  readonly gaps: {
    readonly missingRequirements: boolean;
    readonly requirementsWithoutTraceLink: string[];
  };
}

export class FeatureStatusService {
  constructor(
    private readonly featureRepository: FeatureRepository,
    private readonly artifactRepository: ArtifactRepository,
    private readonly traceLinkRepository: TraceLinkRepository,
  ) {}

  async execute(featureId: string): Promise<FeatureStatusSummary> {
    const [feature, artifacts, traceLinks] = await Promise.all([
      this.featureRepository.getById(featureId),
      this.artifactRepository.list(),
      this.traceLinkRepository.listByArtifactId(featureId),
    ]);

    const requirements = (artifacts as Requirement[])
      .filter((artifact) => artifact.details.featureId === featureId)
      .map((artifact) => artifact.id);

    const linksByRequirement = new Set(
      traceLinks
        .filter((link) => link.type === "belongs_to_feature")
        .map((link) => `${link.fromId}::${link.toId}`),
    );

    const requirementsWithoutTraceLink = requirements.filter(
      (requirementId) =>
        !linksByRequirement.has(`${requirementId}::${featureId}`) &&
        !linksByRequirement.has(`${featureId}::${requirementId}`),
    );

    return {
      feature:
        feature === null
          ? null
          : {
              id: feature.id,
              name: feature.name,
              status: feature.status,
            },
      requirements: {
        count: requirements.length,
        ids: requirements,
      },
      traceLinks: {
        count: traceLinks.length,
        items: traceLinks,
      },
      gaps: {
        missingRequirements: requirements.length === 0,
        requirementsWithoutTraceLink,
      },
    };
  }
}
