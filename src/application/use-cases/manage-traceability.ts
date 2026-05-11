import type { TraceLink } from "../../domain";
import type {
  ManageTraceabilityQuery,
  ManageTraceabilityUseCase,
} from "../ports/input";
import type { TraceLinkRepository } from "../ports/output";

export class ManageTraceabilityService implements ManageTraceabilityUseCase {
  constructor(private readonly traceLinkRepository: TraceLinkRepository) {}

  async execute(_query: ManageTraceabilityQuery): Promise<void> {
    return Promise.resolve();
  }

  async create(link: TraceLink): Promise<void> {
    await this.traceLinkRepository.save(link);
  }

  async list(artifactId?: string): Promise<TraceLink[]> {
    if (artifactId && artifactId.length > 0) {
      return this.traceLinkRepository.listByArtifactId(artifactId);
    }
    return this.traceLinkRepository.list();
  }

  async remove(link: TraceLink): Promise<void> {
    await this.traceLinkRepository.delete(link);
  }
}
