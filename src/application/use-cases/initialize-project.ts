import type {
  InitializeProjectUseCase,
  InitializeProjectCommand,
} from "../ports/input";
export class InitializeProjectService implements InitializeProjectUseCase {
  async execute(_command: InitializeProjectCommand): Promise<void> {
    return Promise.resolve();
  }
}
