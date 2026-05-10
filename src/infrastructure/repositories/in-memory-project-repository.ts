import type { ProjectRepository } from "../../application";
import type { Project } from "../../domain";
export class InMemoryProjectRepository implements ProjectRepository {
  async save(_project: Project): Promise<void> {
    return Promise.resolve();
  }
  async getById(_projectId: string): Promise<Project | null> {
    return Promise.resolve(null);
  }
}
