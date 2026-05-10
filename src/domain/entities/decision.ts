import type { KnowledgeArtifact } from "./knowledge-artifact";
export interface Decision extends KnowledgeArtifact {
  readonly summary: string;
}
