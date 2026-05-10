import type { ArtifactStatus } from "../value-objects/artifact-status";
export interface ArtifactLifecyclePolicy {
  canTransition(from: ArtifactStatus, to: ArtifactStatus): boolean;
}
