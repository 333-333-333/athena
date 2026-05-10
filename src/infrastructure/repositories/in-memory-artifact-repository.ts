import type { ArtifactRepository } from "../../application";
import type { KnowledgeArtifact } from "../../domain";

export class InMemoryArtifactRepository implements ArtifactRepository {
  private readonly artifacts = new Map<string, KnowledgeArtifact>();

  async save(artifact: KnowledgeArtifact): Promise<void> {
    this.artifacts.set(artifact.id, {
      ...artifact,
      version: {
        ...artifact.version,
      },
    });
  }

  async getById(artifactId: string): Promise<KnowledgeArtifact | null> {
    const artifact = this.artifacts.get(artifactId);

    if (artifact === undefined) {
      return null;
    }

    return {
      ...artifact,
      version: {
        ...artifact.version,
      },
    };
  }
}
