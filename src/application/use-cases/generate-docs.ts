import type { GenerateDocsQuery, GenerateDocsUseCase } from "../ports/input";
export class GenerateDocsService implements GenerateDocsUseCase {
  async execute(_query: GenerateDocsQuery): Promise<void> {
    return Promise.resolve();
  }
}
