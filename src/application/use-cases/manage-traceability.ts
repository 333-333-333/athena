import type {
  ManageTraceabilityQuery,
  ManageTraceabilityUseCase,
} from "../ports/input";
export class ManageTraceabilityService implements ManageTraceabilityUseCase {
  async execute(_query: ManageTraceabilityQuery): Promise<void> {
    return Promise.resolve();
  }
}
