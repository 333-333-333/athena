import { describe, expect, it } from "bun:test";
import {
  createAthenaConfig,
  DEFAULT_SQLITE_PATH,
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

  it("loads sqlite default path when env does not set one", () => {
    expect(
      loadAthenaConfig({
        ATHENA_ENV: "production",
        ATHENA_PERSISTENCE: "sqlite",
      }),
    ).toEqual({
      env: "production",
      persistence: { kind: "sqlite", sqlitePath: DEFAULT_SQLITE_PATH },
    });
  });

  it("loads sqlite custom path from env", () => {
    expect(
      loadAthenaConfig({
        ATHENA_ENV: "production",
        ATHENA_PERSISTENCE: "sqlite",
        ATHENA_SQLITE_PATH: "/tmp/custom-athena.sqlite",
      }),
    ).toEqual({
      env: "production",
      persistence: { kind: "sqlite", sqlitePath: "/tmp/custom-athena.sqlite" },
    });
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

  it("rejects sqlite with blank sqlitePath", () => {
    expect(() =>
      validateAthenaConfig(
        buildAthenaConfig({
          env: "production",
          persistence: { kind: "sqlite", sqlitePath: "" },
        }),
      ),
    ).toThrow(/sqlitePath/i);
  });
});
