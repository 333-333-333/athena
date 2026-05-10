import { athenaConfigFixtures } from "./infrastructure/config/athena-config.fixtures";
export const compositionRootFixtures = {
  testMemoryConfig: athenaConfigFixtures.testMemory,
  productionSqliteConfig: athenaConfigFixtures.productionSqlite,
} as const;
