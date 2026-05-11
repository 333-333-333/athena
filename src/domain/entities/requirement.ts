import type { KnowledgeArtifact } from "./knowledge-artifact";

export type RequirementKind = "functional" | "non_functional" | "constraint";
export type NormativeLevel =
  | "must"
  | "must_not"
  | "should"
  | "should_not"
  | "may";

export interface RequirementDetails {
  readonly subject: string;
  readonly normativeLevel: NormativeLevel;
  readonly requirement: string;
  readonly statement: string;
  readonly featureId?: string;
}

export interface Requirement extends KnowledgeArtifact {
  readonly kind: RequirementKind;
  readonly priority: string;
  readonly details: RequirementDetails;
}
