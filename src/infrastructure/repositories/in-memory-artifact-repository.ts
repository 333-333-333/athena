import type { ArtifactRepository } from "../../application";
import type { KnowledgeArtifact } from "../../domain";

export class InMemoryArtifactRepository implements ArtifactRepository {
  private readonly artifacts = new Map<string, KnowledgeArtifact>();

  async create(artifact: KnowledgeArtifact): Promise<void> {
    this.artifacts.set(artifact.id, this.clone(artifact));
  }

  async save(artifact: KnowledgeArtifact): Promise<void> {
    await this.create(artifact);
  }

  async getById(artifactId: string): Promise<KnowledgeArtifact | null> {
    const artifact = this.artifacts.get(artifactId);
    return artifact === undefined ? null : this.clone(artifact);
  }

  async list(): Promise<KnowledgeArtifact[]> {
    return [...this.artifacts.values()].map((artifact) => this.clone(artifact));
  }

  async update(artifactId: string, artifact: KnowledgeArtifact): Promise<void> {
    this.artifacts.set(artifactId, this.clone(artifact));
  }

  async delete(artifactId: string): Promise<void> {
    this.artifacts.delete(artifactId);
  }

  private clone(artifact: KnowledgeArtifact): KnowledgeArtifact {
    return {
      ...artifact,
      version: {
        ...artifact.version,
      },
    };
  }
}
