import { describe, expect, it } from "bun:test";
import { InMemoryTraceLinkRepository } from "../../../src/infrastructure/repositories/in-memory-trace-link-repository";
import { inMemoryTraceLinkRepositoryFixtures } from "./in-memory-trace-link-repository.fixtures";

describe("in-memory-trace-link-repository", () => {
  it("supports save/list/delete", async () => {
    const repository = new InMemoryTraceLinkRepository();
    const { first, second, third } = inMemoryTraceLinkRepositoryFixtures;

    await repository.save(first);
    await repository.save(second);
    await repository.save(third);

    expect(await repository.listByArtifactId("REQ-1")).toEqual([first, second]);
    expect(await repository.listByArtifactId("UC-1")).toEqual([first, third]);

    await repository.delete(first);

    expect(await repository.listByArtifactId("REQ-1")).toEqual([second]);
    expect(await repository.listByArtifactId("UC-1")).toEqual([third]);
  });
});
