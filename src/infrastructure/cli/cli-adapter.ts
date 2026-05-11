import { basename } from "node:path";
import {
  type AppComposition,
  createAppComposition,
} from "../../composition-root";
import {
  createAthenaConfig,
  DEFAULT_SQLITE_PATH,
} from "../config/athena-config";

type CreateCompositionOptions = {
  readonly sqlitePath?: string;
};

type CreateComposition = (
  options?: CreateCompositionOptions,
) => Promise<AppComposition>;

export interface CliInterfaceAdapterOptions {
  readonly createComposition?: CreateComposition;
  readonly cwd?: () => string;
  readonly now?: () => string;
  readonly writeLine?: (line: string) => void;
}

export class CliInterfaceAdapter {
  private readonly createComposition: CreateComposition;
  private readonly cwd: () => string;
  private readonly now: () => string;
  private readonly writeLine: (line: string) => void;

  constructor(options: CliInterfaceAdapterOptions = {}) {
    this.createComposition = options.createComposition ?? createCliComposition;
    this.cwd = options.cwd ?? process.cwd;
    this.now = options.now ?? (() => new Date().toISOString());
    this.writeLine = options.writeLine ?? ((line) => console.log(line));
  }

  async run(argv: readonly string[]): Promise<void> {
    const jsonOutput = hasFlag(argv, "--json");
    const normalizedArgv = stripFlag(stripOption(argv, "--db"), "--json");
    const [command, ...args] = normalizedArgv;
    const sqlitePath = readOption(argv, "--db");

    if (command === "init") {
      const composition = await this.createComposition({ sqlitePath });
      const projectId = readOption(args, "--id") ?? basename(this.cwd());
      const projectName = readOption(args, "--name") ?? projectId;
      const project = await composition.useCases.initializeProject.execute({
        projectId,
        projectName,
        createdAt: this.now(),
      });
      if (jsonOutput) {
        this.writeLine(JSON.stringify(project));
      } else {
        this.writeLine(`Initialized project ${project.id} (${project.name})`);
      }
      return;
    }
    if (command === "project" && args[0] === "status") {
      const composition = await this.createComposition({ sqlitePath });
      const status = await composition.useCases.projectStatus.execute();
      this.writeLine(
        jsonOutput ? JSON.stringify(status) : formatProjectStatusOutput(status),
      );
      return;
    }
    if (command === "feature" && args[0] === "create") {
      const featureId = args[1] ?? "";
      const composition = await this.createComposition({ sqlitePath });
      const createdAt = this.now();
      const updatedAt = this.now();
      await composition.useCases.manageFeature.create({
        id: featureId,
        name: readOption(args, "--name") ?? featureId,
        description: readOption(args, "--description") ?? "",
        status: "draft",
        createdAt,
        updatedAt,
      });
      const feature = await composition.useCases.manageFeature.get(featureId);
      if (jsonOutput) {
        this.writeLine(JSON.stringify(feature));
      } else {
        this.writeLine(`Created feature ${featureId}`);
      }
      return;
    }
    if (command === "feature" && args[0] === "get") {
      const composition = await this.createComposition({ sqlitePath });
      const feature = await composition.useCases.manageFeature.get(
        args[1] ?? "",
      );
      this.writeLine(
        jsonOutput ? JSON.stringify(feature) : formatFeatureGetOutput(feature),
      );
      return;
    }
    if (command === "feature" && args[0] === "list") {
      const composition = await this.createComposition({ sqlitePath });
      const features = await composition.useCases.manageFeature.list();
      this.writeLine(
        jsonOutput
          ? JSON.stringify(features)
          : formatFeatureListOutput(features),
      );
      return;
    }
    if (command === "feature" && args[0] === "update") {
      const composition = await this.createComposition({ sqlitePath });
      const featureId = args[1] ?? "";
      await composition.useCases.manageFeature.update(featureId, {
        name: readOption(args, "--name"),
        description: readOption(args, "--description"),
        updatedAt: this.now(),
      });
      const feature = await composition.useCases.manageFeature.get(featureId);
      if (jsonOutput) {
        this.writeLine(JSON.stringify(feature));
      } else {
        this.writeLine(`Updated feature ${featureId}`);
      }
      return;
    }
    if (command === "feature" && args[0] === "delete") {
      const composition = await this.createComposition({ sqlitePath });
      const featureId = args[1] ?? "";
      await composition.useCases.manageFeature.delete(featureId);
      if (jsonOutput) {
        this.writeLine(JSON.stringify({ deleted: featureId }));
      } else {
        this.writeLine(`Deleted feature ${featureId}`);
      }
      return;
    }

    if (command === "requirement" && args[0] === "create") {
      const createArgs = args.slice(1);
      const composition = await this.createComposition({ sqlitePath });
      const command = buildRequirementCommand(createArgs, createArgs[0] ?? "");
      await composition.useCases.manageArtifact.execute(command);
      const requirement = await composition.useCases.manageArtifact.get(
        command.artifactId,
      );
      if (jsonOutput) {
        this.writeLine(JSON.stringify(requirement));
      } else {
        this.writeLine(`Created requirement ${command.artifactId}`);
      }
      return;
    }
    if (command === "requirement" && args[0] === "get") {
      const composition = await this.createComposition({ sqlitePath });
      const requirement = await composition.useCases.manageArtifact.get(
        args[1] ?? "",
      );
      this.writeLine(
        jsonOutput
          ? JSON.stringify(requirement)
          : formatRequirementGetOutput(requirement),
      );
      return;
    }
    if (command === "requirement" && args[0] === "list") {
      const composition = await this.createComposition({ sqlitePath });
      const requirements = await composition.useCases.manageArtifact.list();
      this.writeLine(
        jsonOutput
          ? JSON.stringify(requirements)
          : formatRequirementListOutput(requirements),
      );
      return;
    }
    if (command === "requirement" && args[0] === "update") {
      const updateArgs = args.slice(2);
      const composition = await this.createComposition({ sqlitePath });
      const artifactId = args[1] ?? "";
      await composition.useCases.manageArtifact.update(
        artifactId,
        buildRequirementUpdateCommand(updateArgs),
      );
      const requirement =
        await composition.useCases.manageArtifact.get(artifactId);
      if (jsonOutput) {
        this.writeLine(JSON.stringify(requirement));
      } else {
        this.writeLine(`Updated requirement ${artifactId}`);
      }
      return;
    }
    if (command === "requirement" && args[0] === "delete") {
      const composition = await this.createComposition({ sqlitePath });
      const artifactId = args[1] ?? "";
      await composition.useCases.manageArtifact.delete(artifactId);
      if (jsonOutput) {
        this.writeLine(JSON.stringify({ deleted: artifactId }));
      } else {
        this.writeLine(`Deleted requirement ${artifactId}`);
      }
    }
  }
}

const formatFeatureGetOutput = (
  feature: {
    id: string;
    name: string;
    status: string;
  } | null,
) =>
  feature === null
    ? "Feature not found"
    : `${feature.id}  ${feature.name}  ${feature.status}`;

const formatFeatureListOutput = (
  features: ReadonlyArray<{ id: string; name: string; status: string }>,
) =>
  features
    .map((feature) => `${feature.id}  ${feature.name}  ${feature.status}`)
    .join("\n");

const formatRequirementGetOutput = (
  requirement: {
    id: string;
    kind: string;
    details: { featureId?: string; statement?: string; title?: string };
  } | null,
) => {
  if (requirement === null) {
    return "Requirement not found";
  }
  const label =
    requirement.details.statement ?? requirement.details.title ?? "";
  return `${requirement.id}  ${requirement.kind}  ${requirement.details.featureId ?? "-"}  ${label}`;
};

const formatRequirementListOutput = (
  requirements: ReadonlyArray<{
    id: string;
    kind: string;
    details: { featureId?: string; statement?: string; title?: string };
  }>,
) =>
  requirements
    .map((requirement) => {
      const label =
        requirement.details.statement ?? requirement.details.title ?? "";
      return `${requirement.id}  ${requirement.kind}  ${requirement.details.featureId ?? "-"}  ${label}`;
    })
    .join("\n");

const createCliComposition: CreateComposition = async ({ sqlitePath } = {}) => {
  const env = resolveCliEnvironment(process.env.ATHENA_ENV);
  const persistence =
    sqlitePath !== undefined ||
    process.env.ATHENA_SQLITE_PATH !== undefined ||
    env !== "test"
      ? {
          kind: "sqlite" as const,
          sqlitePath:
            sqlitePath ?? process.env.ATHENA_SQLITE_PATH ?? DEFAULT_SQLITE_PATH,
        }
      : { kind: "memory" as const };

  return createAppComposition(
    createAthenaConfig({
      env,
      persistence,
    }),
  );
};

const resolveCliEnvironment = (
  value: string | undefined,
): "test" | "development" | "production" => {
  if (value === "test" || value === "development" || value === "production") {
    return value;
  }

  return "development";
};

const buildRequirementCommand = (args: readonly string[], fallbackId = "") => ({
  artifactId: readOption(args, "--id") ?? fallbackId,
  kind: (readOption(args, "--kind") ?? "functional") as
    | "functional"
    | "non_functional"
    | "constraint",
  title: readOption(args, "--title") ?? "",
  subject: readOption(args, "--subject") ?? "",
  normativeLevel: (readOption(args, "--level") ?? "must") as
    | "must"
    | "must_not"
    | "should"
    | "should_not"
    | "may",
  requirement: readOption(args, "--requirement") ?? "",
  priority: readOption(args, "--priority") ?? "medium",
  featureId: readOption(args, "--feature"),
});

const buildRequirementUpdateCommand = (args: readonly string[]) => ({
  artifactId: readOption(args, "--id"),
  kind: readOption(args, "--kind") as
    | "functional"
    | "non_functional"
    | "constraint"
    | undefined,
  title: readOption(args, "--title"),
  subject: readOption(args, "--subject"),
  normativeLevel: readOption(args, "--level") as
    | "must"
    | "must_not"
    | "should"
    | "should_not"
    | "may"
    | undefined,
  requirement: readOption(args, "--requirement"),
  priority: readOption(args, "--priority"),
  featureId: readOption(args, "--feature"),
});

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

const stripOption = (args: readonly string[], optionName: string): string[] => {
  const normalized: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === optionName) {
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        i += 1;
      }
      continue;
    }

    if (token !== undefined) {
      normalized.push(token);
    }
  }

  return normalized;
};

const stripFlag = (args: readonly string[], flagName: string): string[] =>
  args.filter((token) => token !== flagName);

const hasFlag = (args: readonly string[], flagName: string): boolean =>
  args.includes(flagName);

const formatProjectStatusOutput = (status: {
  project: { id: string; name: string } | null;
  counts: { features: number; requirements: number; traceLinks: number };
  gaps: {
    requirementsWithoutFeature: { count: number; ids: string[] };
    featuresWithoutRequirements: { count: number; ids: string[] };
  };
}): string => {
  const projectLine =
    status.project === null
      ? "Project: none"
      : `Project: ${status.project.id} (${status.project.name})`;
  const reqGapLine =
    status.gaps.requirementsWithoutFeature.count === 0
      ? "Requirements without feature: 0"
      : `Requirements without feature: ${status.gaps.requirementsWithoutFeature.count} [${status.gaps.requirementsWithoutFeature.ids.join(", ")}]`;
  const featureGapLine =
    status.gaps.featuresWithoutRequirements.count === 0
      ? "Features without requirements: 0"
      : `Features without requirements: ${status.gaps.featuresWithoutRequirements.count} [${status.gaps.featuresWithoutRequirements.ids.join(", ")}]`;
  return [
    projectLine,
    `Features: ${status.counts.features}`,
    `Requirements: ${status.counts.requirements}`,
    `Trace links: ${status.counts.traceLinks}`,
    reqGapLine,
    featureGapLine,
  ].join("\n");
};
