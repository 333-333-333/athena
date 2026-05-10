import { describe, expect, it } from "bun:test";
import { createAppComposition } from "../src/composition-root";
import { buildCompositionConfig } from "./composition-root.builders";
import { compositionRootFixtures } from "./composition-root.fixtures";

describe("composition-root", () => {
  it("wires memory persistence in test env", async () => {
    const composition = await createAppComposition(
      compositionRootFixtures.testMemoryConfig,
    );
    expect(composition.config).toEqual(
      compositionRootFixtures.testMemoryConfig,
    );
    expect(composition.persistence.projectRepository).toBeDefined();
    expect(composition.persistence.artifactRepository).toBeDefined();
    expect(composition.persistence.approvalRepository).toBeDefined();
    expect(composition.persistence.readinessReportRepository).toBeDefined();
    expect(composition.persistence.productionBriefRepository).toBeDefined();
  });

  it("rejects memory persistence in production", async () => {
    await expect(
      createAppComposition(
        buildCompositionConfig({
          env: "production",
          persistence: { kind: "memory" },
        }),
      ),
    ).rejects.toThrow(/production/i);
  });
});
