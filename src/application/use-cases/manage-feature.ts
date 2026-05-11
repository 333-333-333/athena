import { createFeature, type Feature } from "../../domain";
import type { FeatureRepository } from "../ports/output";

export interface ManageFeatureCommand {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "draft" | "active" | "archived";
  readonly createdAt?: string;
  readonly updatedAt: string;
}

export class ManageFeatureService {
  constructor(private readonly featureRepository: FeatureRepository) {}

  async create(command: ManageFeatureCommand): Promise<void> {
    const existing = await this.featureRepository.getById(command.id);
    if (existing !== null) {
      throw new Error("feature already exists");
    }

    await this.featureRepository.create(
      createFeature({
        ...command,
        createdAt: command.createdAt ?? command.updatedAt,
      }),
    );
  }

  async get(id: string): Promise<Feature | null> {
    return this.featureRepository.getById(id);
  }

  async list(): Promise<Feature[]> {
    return this.featureRepository.list();
  }

  async update(
    id: string,
    changes: Partial<Omit<Feature, "id" | "createdAt">>,
  ): Promise<void> {
    const existing = await this.featureRepository.getById(id);
    if (existing === null) {
      throw new Error("feature not found");
    }

    await this.featureRepository.update(id, {
      ...changes,
      updatedAt: changes.updatedAt ?? new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.featureRepository.getById(id);
    if (existing === null) {
      throw new Error("feature not found");
    }

    await this.featureRepository.delete(id);
  }
}
