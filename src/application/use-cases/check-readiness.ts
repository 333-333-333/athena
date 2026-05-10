import type {
  CheckReadinessUseCase,
  CheckReadinessQuery,
} from "../ports/input";
export class CheckReadinessService implements CheckReadinessUseCase {
  async execute(_query: CheckReadinessQuery): Promise<void> {
    return Promise.resolve();
  }
}
