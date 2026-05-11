import type { FeatureRepository } from "../../application/ports/output";
import type { Feature } from "../../domain";

export class InMemoryFeatureRepository implements FeatureRepository {
  private readonly items = new Map<string, Feature>();

  async create(feature: Feature): Promise<void> {
    this.items.set(feature.id, { ...feature });
  }

  async getById(id: string): Promise<Feature | null> {
    return this.items.get(id) ?? null;
  }

  async list(): Promise<Feature[]> {
    return Array.from(this.items.values());
  }

  async update(
    id: string,
    changes: Partial<Omit<Feature, "id" | "createdAt">>,
  ): Promise<void> {
    const found = this.items.get(id);
    if (!found) {
      return;
    }

    this.items.set(id, { ...found, ...changes });
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
