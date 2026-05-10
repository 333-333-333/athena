import { describe, expect, it } from "bun:test";
import { createAppComposition } from "../src/composition-root";
import { buildCompositionRootNeo4jConfig } from "./composition-root.neo4j.builders";
import { compositionRootNeo4jFixtures } from "./composition-root.neo4j.fixtures";

describe("composition-root neo4j", () => {
  it("wires neo4j persistence in production env", async () => {
    const composition = await createAppComposition(
      compositionRootNeo4jFixtures.config,
    );

    expect(composition.config).toEqual(compositionRootNeo4jFixtures.config);
    expect(composition.persistence.projectRepository).toBeDefined();
    expect(composition.persistence.artifactRepository).toBeDefined();
    expect(composition.persistence.approvalRepository).toBeDefined();
    expect(composition.persistence.readinessReportRepository).toBeDefined();
    expect(composition.persistence.productionBriefRepository).toBeDefined();
  });

  it("rejects memory persistence in production", async () => {
    await expect(
      createAppComposition(
        buildCompositionRootNeo4jConfig({ persistence: { kind: "memory" } }),
      ),
    ).rejects.toThrow(/production/i);
  });
});
