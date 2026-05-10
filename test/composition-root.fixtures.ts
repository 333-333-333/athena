import { athenaConfigFixtures } from "./infrastructure/config/athena-config.fixtures";
export const compositionRootFixtures = {
  testMemoryConfig: athenaConfigFixtures.testMemory,
  productionNeo4jConfig: athenaConfigFixtures.productionNeo4j,
} as const;
