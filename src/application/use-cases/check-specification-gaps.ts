import type {
  CheckSpecificationGapsQuery,
  CheckSpecificationGapsUseCase,
} from "../ports/input";
export class CheckSpecificationGapsService
  implements CheckSpecificationGapsUseCase
{
  async execute(_query: CheckSpecificationGapsQuery): Promise<void> {
    return Promise.resolve();
  }
}
