import type { Feature } from "../../../domain";

export interface FeatureRepository {
  create(feature: Feature): Promise<void>;
  getById(id: string): Promise<Feature | null>;
  list(): Promise<Feature[]>;
  update(
    id: string,
    changes: Partial<Omit<Feature, "id" | "createdAt">>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
