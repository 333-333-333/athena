import type { TraceLinkRepository } from "../../application";
import type { TraceLink } from "../../domain";

const traceLinkKey = (link: TraceLink): string =>
  `${link.fromId}::${link.toId}::${link.type}`;

export class InMemoryTraceLinkRepository implements TraceLinkRepository {
  private readonly links = new Map<string, TraceLink>();

  async save(link: TraceLink): Promise<void> {
    this.links.set(traceLinkKey(link), { ...link });
  }

  async listByArtifactId(artifactId: string): Promise<TraceLink[]> {
    const matches: TraceLink[] = [];

    for (const link of this.links.values()) {
      if (link.fromId === artifactId || link.toId === artifactId) {
        matches.push({ ...link });
      }
    }

    return matches;
  }

  async list(): Promise<TraceLink[]> {
    return Array.from(this.links.values()).map((link) => ({ ...link }));
  }

  async delete(link: TraceLink): Promise<void> {
    this.links.delete(traceLinkKey(link));
  }
}
