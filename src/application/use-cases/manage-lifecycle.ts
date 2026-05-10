import type {
  ManageLifecycleUseCase,
  ManageLifecycleCommand,
} from "../ports/input";
export class ManageLifecycleService implements ManageLifecycleUseCase {
  async execute(_command: ManageLifecycleCommand): Promise<void> {
    return Promise.resolve();
  }
}
