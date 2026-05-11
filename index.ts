import { CliInterfaceAdapter } from "./src/infrastructure";

export { createAppComposition } from "./src/composition-root";

if (import.meta.main) {
  await new CliInterfaceAdapter().run(process.argv.slice(2));
}
