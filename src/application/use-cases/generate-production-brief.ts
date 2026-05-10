import type {
  GenerateProductionBriefQuery,
  GenerateProductionBriefUseCase,
} from "../ports/input";
export class GenerateProductionBriefService
  implements GenerateProductionBriefUseCase
{
  async execute(_query: GenerateProductionBriefQuery): Promise<void> {
    return Promise.resolve();
  }
}
