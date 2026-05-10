import { describe, expect, it } from "bun:test";
import { InMemoryProductionBriefRepository } from "../../../src/infrastructure/repositories/in-memory-production-brief-repository";
import { buildProductionBrief } from "./in-memory-production-brief-repository.builders";
import { inMemoryProductionBriefRepositoryFixtures } from "./in-memory-production-brief-repository.fixtures";

describe("in-memory-production-brief-repository", () => {
  it("saves and reads a production brief", async () => {
    const repository = new InMemoryProductionBriefRepository();
    await repository.save(buildProductionBrief());
    expect(await repository.getByProjectId("project-1")).toEqual(
      inMemoryProductionBriefRepositoryFixtures.brief,
    );
  });
});
