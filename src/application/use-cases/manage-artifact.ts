import type { ArtifactId, NormativeLevel, Requirement } from "../../domain";
import type {
  ManageArtifactCommand,
  ManageArtifactUseCase,
  UpdateArtifactCommand,
} from "../ports/input";
import type { ArtifactRepository, FeatureRepository } from "../ports/output";

const NORMATIVE_WORD_BY_LEVEL: Record<NormativeLevel, string> = {
  must: "MUST",
  must_not: "MUST NOT",
  should: "SHOULD",
  should_not: "SHOULD NOT",
  may: "MAY",
};

export class ManageArtifactService implements ManageArtifactUseCase {
  constructor(
    private readonly artifactRepository: ArtifactRepository,
    private readonly featureRepository?: FeatureRepository,
  ) {}

  async execute(command: ManageArtifactCommand): Promise<void> {
    const existing = await this.artifactRepository.getById(command.artifactId);
    if (existing !== null) {
      throw new Error("artifact already exists");
    }

    await this.validateFeatureId(command.featureId);
    await this.artifactRepository.create(this.buildRequirement(command));
  }

  async get(artifactId: string): Promise<Requirement | null> {
    return (await this.artifactRepository.getById(
      artifactId,
    )) as Requirement | null;
  }

  async list(): Promise<Requirement[]> {
    return (await this.artifactRepository.list()) as Requirement[];
  }

  async update(
    artifactId: string,
    command: UpdateArtifactCommand,
  ): Promise<void> {
    const existing = await this.artifactRepository.getById(artifactId);
    if (existing === null) {
      throw new Error("artifact not found");
    }

    const merged = this.mergeUpdateCommand(
      existing as Requirement,
      command,
      artifactId,
    );
    await this.validateFeatureId(merged.featureId);
    await this.artifactRepository.update(
      artifactId,
      this.buildRequirement(merged),
    );
  }

  async delete(artifactId: string): Promise<void> {
    const existing = await this.artifactRepository.getById(artifactId);
    if (existing === null) {
      throw new Error("artifact not found");
    }

    await this.artifactRepository.delete(artifactId);
  }

  private async validateFeatureId(featureId?: string): Promise<void> {
    if (featureId === undefined || featureId.trim().length === 0) {
      return;
    }
    if (this.featureRepository === undefined) {
      throw new Error("feature repository not configured");
    }

    const feature = await this.featureRepository.getById(featureId);
    if (feature === null) {
      throw new Error("feature not found");
    }
  }

  private buildRequirement(command: ManageArtifactCommand): Requirement {
    const subject = command.subject.trim();
    if (subject.length === 0) {
      throw new Error("subject must not be empty");
    }

    const requirement = command.requirement.trim();
    if (requirement.length === 0) {
      throw new Error("requirement must not be empty");
    }

    const normativeWord = NORMATIVE_WORD_BY_LEVEL[command.normativeLevel];
    if (normativeWord === undefined) {
      throw new Error(
        "normativeLevel must be one of: must, must_not, should, should_not, may",
      );
    }

    return {
      id: command.artifactId as ArtifactId,
      title: command.title,
      kind: command.kind,
      priority: command.priority,
      status: "draft",
      version: { major: 1, minor: 0, patch: 0 },
      details: {
        subject,
        normativeLevel: command.normativeLevel,
        requirement,
        statement: `${subject} ${normativeWord} ${requirement}.`,
        featureId: command.featureId,
      },
    };
  }

  private mergeUpdateCommand(
    existing: Requirement,
    command: UpdateArtifactCommand,
    artifactId: string,
  ): ManageArtifactCommand {
    const existingDetails = existing.details;
    return {
      artifactId,
      kind: command.kind ?? existing.kind,
      title: command.title ?? existing.title,
      subject: command.subject ?? existingDetails.subject,
      normativeLevel: command.normativeLevel ?? existingDetails.normativeLevel,
      requirement: command.requirement ?? existingDetails.requirement,
      priority: command.priority ?? existing.priority,
      featureId: command.featureId ?? existingDetails.featureId,
    };
  }
}
