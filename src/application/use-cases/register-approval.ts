import type {
  RegisterApprovalCommand,
  RegisterApprovalUseCase,
} from "../ports/input";
export class RegisterApprovalService implements RegisterApprovalUseCase {
  async execute(_command: RegisterApprovalCommand): Promise<void> {
    return Promise.resolve();
  }
}
