import type {
  ManageArtifactCommand,
  ManageArtifactUseCase,
} from "../ports/input";
export class ManageArtifactService implements ManageArtifactUseCase {
  async execute(_command: ManageArtifactCommand): Promise<void> {
    return Promise.resolve();
  }
}
