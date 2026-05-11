import { describe, expect, it } from "bun:test";
import { CliInterfaceAdapter } from "../../../src/infrastructure";
import { buildCliComposition } from "./cli-adapter.builders";
import { cliAdapterFixtures } from "./cli-adapter.fixtures";

describe("infrastructure/cli/cli-adapter.ts", () => {
  it("runs init command through initialize-project use case", async () => {
    const composition = buildCliComposition();
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
      now: () => "2026-05-10T00:00:00.000Z",
    });

    await adapter.run(cliAdapterFixtures.argv);

    expect(
      await composition.persistence.projectRepository.getById("athena"),
    ).toMatchObject(cliAdapterFixtures.project);
  });
});
