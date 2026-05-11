export type FeatureStatus = "draft" | "active" | "archived";

export interface Feature {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: FeatureStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const createFeature = (input: Feature): Feature => ({ ...input });
