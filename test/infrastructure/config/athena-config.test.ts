import { describe, expect, it } from "bun:test";
import {
  createAthenaConfig,
  loadAthenaConfig,
  validateAthenaConfig,
} from "../../../src/infrastructure/config/athena-config";
import { buildAthenaConfig } from "./athena-config.builders";
import { athenaConfigFixtures } from "./athena-config.fixtures";

describe("athena-config", () => {
  it("creates a normalized config", () => {
    expect(createAthenaConfig(athenaConfigFixtures.testMemory)).toEqual(
      athenaConfigFixtures.testMemory,
    );
  });

  it("loads test memory defaults from env", () => {
    expect(
      loadAthenaConfig({ ATHENA_ENV: "test", ATHENA_PERSISTENCE: "memory" }),
    ).toEqual(athenaConfigFixtures.testMemory);
  });

  it("rejects memory in production", () => {
    expect(() =>
      validateAthenaConfig(
        buildAthenaConfig({
          env: "production",
          persistence: { kind: "memory" },
        }),
      ),
    ).toThrow(/production/i);
  });
});
