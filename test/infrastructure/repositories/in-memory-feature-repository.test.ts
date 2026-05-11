import { describe, expect, it } from "bun:test";
import { InMemoryFeatureRepository } from "../../../src/infrastructure/repositories/in-memory-feature-repository";
import { inMemoryFeatureRepositoryFixtures } from "./in-memory-feature-repository.fixtures";

describe("infrastructure/repositories/in-memory-feature-repository", () => {
  it("CRUD básico", async () => {
    // RF-031 AC-1 | BR-031-01
    const repository = new InMemoryFeatureRepository();
    await repository.create(inMemoryFeatureRepositoryFixtures.feature);
    expect(
      await repository.getById(inMemoryFeatureRepositoryFixtures.feature.id),
    ).toEqual(inMemoryFeatureRepositoryFixtures.feature);
    expect((await repository.list()).length).toBe(1);
    await repository.update(inMemoryFeatureRepositoryFixtures.feature.id, {
      name: "updated",
    });
    await repository.delete(inMemoryFeatureRepositoryFixtures.feature.id);
  });
});
