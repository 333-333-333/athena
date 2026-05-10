import type { ReadinessReportRepository } from "../../application";
import type { ReadinessReport } from "../../domain";

export class InMemoryReadinessReportRepository
  implements ReadinessReportRepository
{
  private readonly reports = new Map<string, ReadinessReport>();

  async save(report: ReadinessReport): Promise<void> {
    this.reports.set(report.projectId, {
      ...report,
      gates: report.gates.map((gate) => ({ ...gate })),
    });
  }

  async getByProjectId(projectId: string): Promise<ReadinessReport | null> {
    const report = this.reports.get(projectId);

    if (report === undefined) {
      return null;
    }

    return {
      ...report,
      gates: report.gates.map((gate) => ({ ...gate })),
    };
  }
}
