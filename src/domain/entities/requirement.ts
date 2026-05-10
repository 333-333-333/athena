import type { KnowledgeArtifact } from "./knowledge-artifact";
export interface Requirement extends KnowledgeArtifact {
  readonly kind: "functional" | "non_functional" | "constraint";
}
