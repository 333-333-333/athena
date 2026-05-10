import type {
  InitializeProjectCommand,
  InitializeProjectUseCase,
} from "../ports/input";
export class InitializeProjectService implements InitializeProjectUseCase {
  async execute(_command: InitializeProjectCommand): Promise<void> {
    return Promise.resolve();
  }
}
