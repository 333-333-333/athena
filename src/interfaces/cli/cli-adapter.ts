import type { AppComposition } from "../../composition-root";
export class CliInterfaceAdapter {
  constructor(private readonly _app: AppComposition) {}
  async run(_argv: readonly string[]): Promise<void> {
    return Promise.resolve();
  }
}
