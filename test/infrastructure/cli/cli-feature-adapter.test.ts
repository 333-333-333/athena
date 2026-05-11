import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CliInterfaceAdapter } from "../../../src/infrastructure/cli/cli-adapter";
import { buildSqliteCliComposition } from "./cli-adapter.builders";
import { cliFeatureFixtures } from "./cli-feature-adapter.fixtures";

const tempDirs: string[] = [];
const createTempDbPath = async () => {
  const dir = await mkdtemp(join(tmpdir(), "athena-feature-cli-"));
  tempDirs.push(dir);
  return join(dir, "athena.sqlite");
};
afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("infrastructure/cli/cli-adapter feature", () => {
  it("feature create/get/list/update/delete", async () => {
    // RF-031 AC-1 | BR-031-01 | CON-031-01
    const composition = await buildSqliteCliComposition(
      await createTempDbPath(),
    );
    const adapter = new CliInterfaceAdapter({
      createComposition: async () => composition,
    });
    await adapter.run(cliFeatureFixtures.createArgv);
    await adapter.run(cliFeatureFixtures.getArgv);
    await adapter.run(cliFeatureFixtures.listArgv);
    await adapter.run(cliFeatureFixtures.updateArgv);
    await adapter.run(cliFeatureFixtures.deleteArgv);
    expect(true).toBe(true);
  });
});
