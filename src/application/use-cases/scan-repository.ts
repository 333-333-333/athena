import type {
  ScanRepositoryUseCase,
  ScanRepositoryQuery,
} from "../ports/input";
export class ScanRepositoryService implements ScanRepositoryUseCase {
  async execute(_query: ScanRepositoryQuery): Promise<void> {
    return Promise.resolve();
  }
}
