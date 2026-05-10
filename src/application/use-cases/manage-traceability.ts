import type {
  ManageTraceabilityUseCase,
  ManageTraceabilityQuery,
} from "../ports/input";
export class ManageTraceabilityService implements ManageTraceabilityUseCase {
  async execute(_query: ManageTraceabilityQuery): Promise<void> {
    return Promise.resolve();
  }
}
