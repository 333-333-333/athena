import { describe, expect, it } from "bun:test";
import { InMemoryReadinessReportRepository } from "../../../src/infrastructure/repositories/in-memory-readiness-report-repository";
import { buildReadinessReport } from "./in-memory-readiness-report-repository.builders";
import { inMemoryReadinessReportRepositoryFixtures } from "./in-memory-readiness-report-repository.fixtures";

describe("in-memory-readiness-report-repository", () => {
  it("saves and reads a readiness report", async () => {
    const repository = new InMemoryReadinessReportRepository();
    await repository.save(buildReadinessReport());
    expect(await repository.getByProjectId("project-1")).toEqual(
      inMemoryReadinessReportRepositoryFixtures.report,
    );
  });
});
