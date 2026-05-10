import type {
  ScanRepositoryQuery,
  ScanRepositoryUseCase,
} from "../ports/input";
export class ScanRepositoryService implements ScanRepositoryUseCase {
  async execute(_query: ScanRepositoryQuery): Promise<void> {
    return Promise.resolve();
  }
}
