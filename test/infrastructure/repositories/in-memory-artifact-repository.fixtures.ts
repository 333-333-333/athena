import type { ArtifactId, KnowledgeArtifact } from "../../../src/domain";

const artifactId = "artifact-1" as ArtifactId;

export const inMemoryArtifactRepositoryFixtures = {
  artifact: {
    id: artifactId,
    title: "Architecture",
    status: "draft",
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
  } satisfies KnowledgeArtifact,
  updatedArtifact: {
    id: artifactId,
    title: "Architecture Updated",
    status: "approved",
    version: {
      major: 1,
      minor: 1,
      patch: 0,
    },
  } satisfies KnowledgeArtifact,
} as const;
