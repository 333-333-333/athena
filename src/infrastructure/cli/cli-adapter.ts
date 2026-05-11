import { basename } from "node:path";
import type { AppComposition } from "../../composition-root";
import { createAppComposition } from "../../composition-root";

export interface CliInterfaceAdapterOptions {
  readonly createComposition?: () => Promise<AppComposition>;
  readonly cwd?: () => string;
  readonly now?: () => string;
}

export class CliInterfaceAdapter {
  private readonly createComposition: () => Promise<AppComposition>;
  private readonly cwd: () => string;
  private readonly now: () => string;

  constructor(options: CliInterfaceAdapterOptions = {}) {
    this.createComposition = options.createComposition ?? createAppComposition;
    this.cwd = options.cwd ?? process.cwd;
    this.now = options.now ?? (() => new Date().toISOString());
  }

  async run(argv: readonly string[]): Promise<void> {
    const [command, ...args] = argv;

    if (command !== "init") {
      return Promise.resolve();
    }

    const composition = await this.createComposition();
    const projectId = readOption(args, "--id") ?? basename(this.cwd());
    const projectName = readOption(args, "--name") ?? projectId;

    await composition.useCases.initializeProject.execute({
      projectId,
      projectName,
      createdAt: this.now(),
    });
  }
}

const readOption = (
  args: readonly string[],
  optionName: string,
): string | undefined => {
  const index = args.indexOf(optionName);

  if (index < 0) {
    return undefined;
  }

  return args[index + 1];
};
