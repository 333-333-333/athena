import type { ProjectRepository } from "../../application";
import type { Project } from "../../domain";

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly projects = new Map<string, Project>();

  async save(project: Project): Promise<void> {
    this.projects.set(project.id, {
      ...project,
    });
  }

  async getById(projectId: string): Promise<Project | null> {
    const project = this.projects.get(projectId);

    if (project === undefined) {
      return null;
    }

    return {
      ...project,
    };
  }

  async list(): Promise<Project[]> {
    return Array.from(this.projects.values()).map((project) => ({
      ...project,
    }));
  }
}
