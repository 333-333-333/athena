import type {
  DocsGenerator,
  GateEvaluator,
  RepositoryScanner,
} from "../../application";
import type { GateResult } from "../../domain";
export class NullRepositoryScanner implements RepositoryScanner {
  async scan(_rootPath: string): Promise<readonly string[]> {
    return Promise.resolve([]);
  }
}
export class NullDocsGenerator implements DocsGenerator {
  async generate(_projectId: string): Promise<void> {
    return Promise.resolve();
  }
}
export class NullGateEvaluator implements GateEvaluator {
  async evaluate(_projectId: string): Promise<readonly GateResult[]> {
    return Promise.resolve([]);
  }
}
