import { describe, expect, it } from "bun:test";
import { ManageFeatureService } from "../../../src/application/use-cases/manage-feature";
import { InMemoryFeatureRepository } from "../../../src/infrastructure/repositories/in-memory-feature-repository";
import { manageFeatureFixtures } from "./manage-feature.fixtures";

describe("application/use-cases/manage-feature", () => {
  it("create/get/list/update/delete happy path", async () => {
    // RF-031 AC-1 | BR-031-01
    const service = new ManageFeatureService(new InMemoryFeatureRepository());
    await service.create(manageFeatureFixtures.create);
    expect((await service.get(manageFeatureFixtures.create.id))?.id).toBe(
      manageFeatureFixtures.create.id,
    );
    expect((await service.list()).length).toBeGreaterThanOrEqual(1);
    await service.update(
      manageFeatureFixtures.create.id,
      manageFeatureFixtures.update,
    );
    await service.delete(manageFeatureFixtures.create.id);
  });
  it("create duplicado falla", async () => {
    // RF-031 AC-2 | BR-031-02
    const service = new ManageFeatureService(new InMemoryFeatureRepository());
    await service.create(manageFeatureFixtures.create);
    await expect(
      service.create(manageFeatureFixtures.create),
    ).rejects.toThrow();
  });
  it("update inexistente falla", async () => {
    // RF-031 AC-3 | BR-031-03
    const service = new ManageFeatureService(new InMemoryFeatureRepository());
    await expect(
      service.update(
        manageFeatureFixtures.missingId,
        manageFeatureFixtures.update,
      ),
    ).rejects.toThrow();
  });
  it("delete inexistente falla", async () => {
    // RF-031 AC-4 | BR-031-04
    const service = new ManageFeatureService(new InMemoryFeatureRepository());
    await expect(
      service.delete(manageFeatureFixtures.missingId),
    ).rejects.toThrow();
  });
});
