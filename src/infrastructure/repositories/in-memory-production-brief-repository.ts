import type { ProductionBriefRepository } from "../../application";
import type { ProductionBrief } from "../../domain";

export class InMemoryProductionBriefRepository
  implements ProductionBriefRepository
{
  private readonly briefs = new Map<string, ProductionBrief>();

  async save(brief: ProductionBrief): Promise<void> {
    this.briefs.set(brief.projectId, {
      ...brief,
    });
  }

  async getByProjectId(projectId: string): Promise<ProductionBrief | null> {
    const brief = this.briefs.get(projectId);

    if (brief === undefined) {
      return null;
    }

    return {
      ...brief,
    };
  }
}
