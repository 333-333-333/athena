import type { Project, Requirement } from "../../domain";
import type {
  ArtifactRepository,
  FeatureRepository,
  ProjectRepository,
  TraceLinkRepository,
} from "../ports/output";

export interface ProjectStatusSummary {
  readonly project: Pick<Project, "id" | "name"> | null;
  readonly counts: {
    readonly features: number;
    readonly requirements: number;
    readonly traceLinks: number;
  };
  readonly gaps: {
    readonly requirementsWithoutFeature: {
      readonly count: number;
      readonly ids: string[];
    };
    readonly featuresWithoutRequirements: {
      readonly count: number;
      readonly ids: string[];
    };
  };
}

export class ProjectStatusService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly featureRepository: FeatureRepository,
    private readonly artifactRepository: ArtifactRepository,
    private readonly traceLinkRepository: TraceLinkRepository,
  ) {}

  async execute(): Promise<ProjectStatusSummary> {
    const [projects, features, artifacts, traceLinks] = await Promise.all([
      this.projectRepository.list(),
      this.featureRepository.list(),
      this.artifactRepository.list(),
      this.traceLinkRepository.list(),
    ]);

    const requirements = artifacts as Requirement[];
    const featureIds = new Set(features.map((feature) => feature.id));

    const requirementsWithoutFeatureIds = requirements
      .filter((requirement) => {
        const linkedFeatureId = requirement.details?.featureId?.trim();
        return linkedFeatureId === undefined || linkedFeatureId.length === 0;
      })
      .map((requirement) => String(requirement.id));

    const requirementsByFeature = new Map<string, number>();
    for (const requirement of requirements) {
      const linkedFeatureId = requirement.details?.featureId?.trim();
      if (linkedFeatureId === undefined || linkedFeatureId.length === 0)
        continue;
      if (!featureIds.has(linkedFeatureId)) {
        requirementsWithoutFeatureIds.push(String(requirement.id));
        continue;
      }
      requirementsByFeature.set(
        linkedFeatureId,
        (requirementsByFeature.get(linkedFeatureId) ?? 0) + 1,
      );
    }

    const featuresWithoutRequirements = features
      .filter((feature) => !requirementsByFeature.has(feature.id))
      .map((feature) => feature.id);

    const project = projects[0] ?? null;

    return {
      project: project === null ? null : { id: project.id, name: project.name },
      counts: {
        features: features.length,
        requirements: requirements.length,
        traceLinks: traceLinks.length,
      },
      gaps: {
        requirementsWithoutFeature: {
          count: requirementsWithoutFeatureIds.length,
          ids: requirementsWithoutFeatureIds.sort(),
        },
        featuresWithoutRequirements: {
          count: featuresWithoutRequirements.length,
          ids: featuresWithoutRequirements.sort(),
        },
      },
    };
  }
}
