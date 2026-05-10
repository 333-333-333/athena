import type { GateResult } from "../../../domain";
export interface RepositoryScanner {
  scan(rootPath: string): Promise<readonly string[]>;
}
export interface DocsGenerator {
  generate(projectId: string): Promise<void>;
}
export interface GateEvaluator {
  evaluate(projectId: string): Promise<readonly GateResult[]>;
}
