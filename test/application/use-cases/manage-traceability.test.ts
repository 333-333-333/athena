import { describe, expect, it } from "bun:test";
import { ManageTraceabilityService } from "../../../src/application/use-cases/manage-traceability";
import { InMemoryTraceLinkRepository } from "../../../src/infrastructure/repositories/in-memory-trace-link-repository";

describe("application/use-cases/manage-traceability.ts", () => {
  it("creates, lists (all and by artifact), and deletes trace links", async () => {
    const repository = new InMemoryTraceLinkRepository();
    const service = new ManageTraceabilityService(repository);

    await service.create({
      fromId: "FUN-001",
      toId: "FEATURE_MANAGEMENT",
      type: "belongs_to_feature",
    });
    await service.create({
      fromId: "FUN-002",
      toId: "FEATURE_MANAGEMENT",
      type: "belongs_to_feature",
    });

    expect(await service.list()).toEqual([
      {
        fromId: "FUN-001",
        toId: "FEATURE_MANAGEMENT",
        type: "belongs_to_feature",
      },
      {
        fromId: "FUN-002",
        toId: "FEATURE_MANAGEMENT",
        type: "belongs_to_feature",
      },
    ]);

    expect(await service.list("FUN-001")).toEqual([
      {
        fromId: "FUN-001",
        toId: "FEATURE_MANAGEMENT",
        type: "belongs_to_feature",
      },
    ]);

    await service.remove({
      fromId: "FUN-001",
      toId: "FEATURE_MANAGEMENT",
      type: "belongs_to_feature",
    });

    expect(await service.list("FUN-001")).toEqual([]);
    expect(await service.list()).toEqual([
      {
        fromId: "FUN-002",
        toId: "FEATURE_MANAGEMENT",
        type: "belongs_to_feature",
      },
    ]);
  });
});
