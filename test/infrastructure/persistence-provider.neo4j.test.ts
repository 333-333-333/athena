import { describe, expect, it } from "bun:test";
import {
  Neo4jPersistenceProvider,
  selectPersistenceProvider,
} from "../../src/infrastructure/persistence-provider";
import { buildNeo4jPersistenceConfig } from "./persistence-provider.neo4j.builders";
import { persistenceProviderNeo4jFixtures } from "./persistence-provider.neo4j.fixtures";

describe("persistence-provider neo4j", () => {
  it("selects neo4j provider", () => {
    expect(
      selectPersistenceProvider(
        persistenceProviderNeo4jFixtures.config.persistence.kind,
      ),
    ).toBeInstanceOf(Neo4jPersistenceProvider);
  });

  it("creates persistence context for neo4j config", async () => {
    const provider = new Neo4jPersistenceProvider();
    const persistence = await provider.createPersistence(
      buildNeo4jPersistenceConfig(),
    );

    expect(persistence.projectRepository).toBeDefined();
    expect(persistence.artifactRepository).toBeDefined();
    expect(persistence.approvalRepository).toBeDefined();
    expect(persistence.readinessReportRepository).toBeDefined();
    expect(persistence.productionBriefRepository).toBeDefined();
  });
});
