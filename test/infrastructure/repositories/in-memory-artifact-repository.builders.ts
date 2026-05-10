import type { ArtifactId, KnowledgeArtifact } from "../../../src/domain";

export const buildArtifact = (
  overrides: Partial<{
    id: ArtifactId;
    title: string;
    status: KnowledgeArtifact["status"];
    version: KnowledgeArtifact["version"];
  }> = {},
): KnowledgeArtifact => ({
  id: overrides.id ?? ("artifact-1" as ArtifactId),
  title: overrides.title ?? "Architecture",
  status: overrides.status ?? "draft",
  version: overrides.version ?? { major: 1, minor: 0, patch: 0 },
});
