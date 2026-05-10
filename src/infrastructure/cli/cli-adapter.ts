export class CliInterfaceAdapter {
  async run(_argv: readonly string[]): Promise<void> {
    return Promise.resolve();
  }
}
