import { describe, expect, it } from "bun:test";
import { InMemoryApprovalRepository } from "../../../src/infrastructure/repositories/in-memory-approval-repository";
import { buildApproval } from "./in-memory-approval-repository.builders";
import { inMemoryApprovalRepositoryFixtures } from "./in-memory-approval-repository.fixtures";

describe("in-memory-approval-repository", () => {
  it("saves and reads an approval", async () => {
    const repository = new InMemoryApprovalRepository();
    await repository.save(buildApproval());
    expect(
      await repository.getById(inMemoryApprovalRepositoryFixtures.approval.id),
    ).toEqual(inMemoryApprovalRepositoryFixtures.approval);
  });
});
