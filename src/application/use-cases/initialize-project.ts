import type { Project } from "../../domain";
import type {
  InitializeProjectCommand,
  InitializeProjectUseCase,
} from "../ports/input";
import type { ProjectRepository } from "../ports/output";

export class InitializeProjectService implements InitializeProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: InitializeProjectCommand): Promise<Project> {
    const existingProject = await this.projectRepository.getById(
      command.projectId,
    );
    const project: Project = {
      id: command.projectId,
      name: command.projectName,
      createdAt:
        existingProject?.createdAt ??
        command.createdAt ??
        new Date().toISOString(),
    };

    await this.projectRepository.save(project);

    return project;
  }
}
