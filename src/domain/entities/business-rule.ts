import type { KnowledgeArtifact } from "./knowledge-artifact";
export interface BusinessRule extends KnowledgeArtifact {
  readonly ruleCode: string;
}
