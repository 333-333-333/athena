import type { ArtifactId } from "../value-objects/artifact-id";
import type { ArtifactStatus } from "../value-objects/artifact-status";
import type { Version } from "../value-objects/version";
export interface KnowledgeArtifact {
  readonly id: ArtifactId;
  readonly title: string;
  readonly status: ArtifactStatus;
  readonly version: Version;
}
