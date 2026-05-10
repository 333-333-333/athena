import type { AppComposition } from "../../composition-root";
export class McpInterfaceAdapter {
  constructor(private readonly _app: AppComposition) {}
  async start(): Promise<void> {
    return Promise.resolve();
  }
}
