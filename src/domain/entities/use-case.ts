import type { KnowledgeArtifact } from "./knowledge-artifact";
export interface UseCase extends KnowledgeArtifact {
  readonly actor: string;
}
