import { describe, expect, it } from "bun:test";
import { createFeature } from "../../../src/domain/entities/feature";
import { buildFeature } from "./feature.builders";
import { featureFixtures } from "./feature.fixtures";

describe("domain/entities/feature", () => {
  it("crea entidad feature válida", () => {
    // RF-031 AC-1 | BR-031-01
    const feature = createFeature(buildFeature());
    expect(feature).toEqual(featureFixtures.base);
  });
});
