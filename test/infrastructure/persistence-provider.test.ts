import { describe, expect, it } from "bun:test";
import {
  InMemoryPersistenceProvider,
  SqlitePersistenceProvider,
  selectPersistenceProvider,
} from "../../src/infrastructure/persistence-provider";
import { buildPersistenceConfig } from "./persistence-provider.builders";
import { persistenceProviderFixtures } from "./persistence-provider.fixtures";

describe("persistence-provider", () => {
  it("selects memory provider", () => {
    expect(
      selectPersistenceProvider(
        persistenceProviderFixtures.memoryConfig.persistence.kind,
      ),
    ).toBeInstanceOf(InMemoryPersistenceProvider);
  });

  it("selects sqlite provider", () => {
    expect(
      selectPersistenceProvider(
        persistenceProviderFixtures.sqliteConfig.persistence.kind,
      ),
    ).toBeInstanceOf(SqlitePersistenceProvider);
  });

  it("memory provider returns working repository", async () => {
    const provider = new InMemoryPersistenceProvider();
    const persistence = await provider.createPersistence(
      buildPersistenceConfig(),
    );
    expect(await persistence.projectRepository.getById("missing")).toBeNull();
    expect(persistence.artifactRepository).toBeDefined();
    expect(persistence.approvalRepository).toBeDefined();
    expect(persistence.readinessReportRepository).toBeDefined();
    expect(persistence.productionBriefRepository).toBeDefined();
  });
});
