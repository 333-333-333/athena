import { describe, expect, it } from "bun:test";
import { InMemoryArtifactRepository } from "../../../src/infrastructure/repositories/in-memory-artifact-repository";
import { buildArtifact } from "./in-memory-artifact-repository.builders";

describe("in-memory-artifact-repository", () => {
  it("supports create/get/list/update/delete", async () => {
    const repository = new InMemoryArtifactRepository();
    await repository.create(buildArtifact());
    expect((await repository.list()).length).toBe(1);
    expect(await repository.getById("artifact-1")).not.toBeNull();

    await repository.update(
      "artifact-1",
      buildArtifact({
        title: "Architecture Updated",
        status: "approved",
        version: { major: 1, minor: 1, patch: 0 },
      }),
    );
    expect((await repository.getById("artifact-1"))?.title).toBe(
      "Architecture Updated",
    );

    await repository.delete("artifact-1");
    expect(await repository.getById("artifact-1")).toBeNull();
  });
});
