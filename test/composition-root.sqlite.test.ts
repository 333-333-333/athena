import { describe, expect, it } from "bun:test";
import { createAppComposition } from "../src/composition-root";
import { buildCompositionRootSqliteConfig } from "./composition-root.sqlite.builders";
import { compositionRootSqliteFixtures } from "./composition-root.sqlite.fixtures";

describe("composition-root sqlite", () => {
  it("wires sqlite persistence in production env", async () => {
    const composition = await createAppComposition(
      compositionRootSqliteFixtures.config,
    );

    expect(composition.config).toEqual(compositionRootSqliteFixtures.config);
    expect(composition.persistence.projectRepository).toBeDefined();
    expect(composition.persistence.artifactRepository).toBeDefined();
    expect(composition.persistence.approvalRepository).toBeDefined();
    expect(composition.persistence.readinessReportRepository).toBeDefined();
    expect(composition.persistence.productionBriefRepository).toBeDefined();
    expect(composition.persistence.traceLinkRepository).toBeDefined();
  });

  it("rejects memory persistence in production", async () => {
    await expect(
      createAppComposition(
        buildCompositionRootSqliteConfig({ persistence: { kind: "memory" } }),
      ),
    ).rejects.toThrow(/production/i);
  });
});
