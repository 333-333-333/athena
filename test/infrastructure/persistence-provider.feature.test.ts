import { describe, expect, it } from "bun:test";
import { InMemoryPersistenceProvider } from "../../src/infrastructure/persistence-provider";

describe("infrastructure/persistence-provider feature repository", () => {
  it("expone featureRepository en context", async () => {
    // CON-031-02 | RF-031 AC-1
    const provider = new InMemoryPersistenceProvider();
    const context = await provider.createPersistence({
      persistence: { kind: "memory" },
      paths: { root: process.cwd() },
    } as never);
    expect(context.featureRepository).toBeDefined();
  });
});
